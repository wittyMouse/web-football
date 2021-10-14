import React, { useState, useEffect, useRef } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/index";
import { setUserInfo } from "../../store/globalSlice";
import "./index.css";
import {
  requestUserInfo,
  requestCreateOrderByNative,
  requestCreateOrderByAlipayPC,
  requestGetRechargeRecordById,
} from "../../service";
import querystring from "querystring";
import RechargeBox from "./components/RechargeBox/index";

interface PayCenterProps extends RouteChildrenProps {}

const typeMap = ["积分", "金币"];

const PayCenter: React.FC<PayCenterProps> = (props) => {
  const { location, history } = props;
  const { token } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  const [orderInfo, setOrderInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [template, setTemplate] = useState<string>("");
  const [rechargeBoxVisible, setRechargeBoxVisible] = useState<boolean>(false);
  const [qrCodeValue, setQrCodeValue] = useState<string>("");
  const [rechargeRecordId, setRechargeRecordId] = useState<number | string>("");
  const timer = useRef<number | string>("");

  /**
   * 获取用户信息
   */
  const getUserInfo = (callback: () => void) => {
    requestUserInfo(token).then((res) => {
      if (res.data.code === 0) {
        const userInfo = res.data.result;
        dispatch(setUserInfo(userInfo));
        callback && callback();
      }
    });
  };

  /**
   * Native 方式创建订单
   * @param data
   */
  const createOrderByNative = (data: any, callback: (res: any) => void) => {
    setLoading(true);
    requestCreateOrderByNative(data)
      .then((res: any) => {
        if (res.data.code === 0) {
          callback && callback(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * 创建阿里 PC 支付
   * @param data
   */
  const createOrderByAlipayPC = (data: any, callback: (res: any) => void) => {
    setLoading(true);
    requestCreateOrderByAlipayPC(data)
      .then((res: any) => {
        if (res.data.code === 0) {
          callback && callback(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * 查询订单
   * @param data
   * @param callback
   */
  const getRechargeRecordById = (data: any, callback: (res: any) => void) => {
    requestGetRechargeRecordById(data).then((res: any) => {
      if (res.data.code === 0) {
        callback && callback(res.data.result);
      } else {
        console.error(res.data.message);
      }
    });
  };

  /**
   * 点击充值按钮
   * @param type
   */
  const onButtonClick = (type: string) => {
    if (loading) {
      return;
    }

    const queryData: any = { id: orderInfo.id, token };
    if (type === "wechat") {
      // 微信支付
      createOrderByNative(queryData, (res) => {
        setRechargeRecordId(res.rechargeRecordId);
        setQrCodeValue(res.payData);
        setRechargeBoxVisible(true);
        timer.current = window.setInterval(() => {
          getRechargeRecordById(
            {
              token,
              rechargeRecordId: res.rechargeRecordId,
            },
            (res) => {
              if (res.status === 1) {
                setRechargeBoxVisible(false);
                setQrCodeValue("");
                setRechargeRecordId("");
                if (timer.current) {
                  window.clearInterval(timer.current as number);
                  timer.current = "";
                }
                getUserInfo(() => {
                  history.push(
                    "/tips?icon=success&title=提示&subTitle=充值成功"
                  );
                });
              }
            }
          );
        }, 5000);
      });
    } else if (type === "alipay") {
      // 支付宝支付
      const { origin, pathname } = window.location;
      if (orderInfo.type === "recharge") {
        // 充值
        queryData.returnUrl = `${origin}${pathname}#/redirect?type=recharge`;
      }
      createOrderByAlipayPC(queryData, (res) => {
        setTemplate(res.payData);
      });
    }
  };

  /**
   * 关闭充值弹窗
   */
  const onRechargeClose = () => {
    setRechargeBoxVisible(false);
    setQrCodeValue("");
    getRechargeRecordById(
      {
        token,
        rechargeRecordId,
      },
      (res) => {
        setRechargeRecordId("");
        if (timer.current) {
          window.clearInterval(timer.current as number);
          timer.current = "";
        }
        if (res.status === 1) {
          history.push("/tips?icon=success&title=提示&subTitle=充值成功");
        }
      }
    );
  };

  useEffect(() => {
    if (template) {
      setTimeout(() => {
        const button = (document as any).body
          .querySelector("div[class=custom-template]")
          .querySelector("input[type=submit]");
        button.click();
      }, 0);
      return () => {
        if (template) {
          setTemplate("");
        }
      };
    }
  }, [template]);

  useEffect(() => {
    const qs = location.search.replace("?", "");
    const qsObj = querystring.parse(qs);
    setOrderInfo(qsObj);
  }, []);

  return (
    <div className="pay-center">
      {rechargeBoxVisible ? (
        <RechargeBox value={qrCodeValue} onClose={onRechargeClose} />
      ) : null}

      <div className="custom-card">
        <h1 className="title-bg02 h-bg14">充值中心</h1>
        <div className="custom-card__content">
          <div className="tips-text">
            温馨提示：如客户的微信单笔支付 2000
            或以上超出限制，如需要充值更多金币可致电客服热线：400-000-1357
            进行充值操作！
          </div>
          <div className="pay-info">
            <span>价格：</span>
            <span className="special-text">{orderInfo.price || ""}</span>
            <span>（元）</span>
            {orderInfo.type === "recharge" ? (
              <>
                &nbsp;&nbsp;
                <span>金币数量：</span>
                <span className="special-text">{orderInfo.price || ""}</span>
                <span>（个）</span>
                &nbsp;&nbsp;
                <span>赠送：</span>
                <span className="special-text">{orderInfo.free || ""}</span>
                <span>（{typeMap[Number(orderInfo.rechargeType)]}）</span>
              </>
            ) : null}
          </div>
          <div className="button-wrapper">
            <button
              className="custom-button wechat"
              type="button"
              onClick={() => onButtonClick("wechat")}
            >
              微信支付
            </button>
            <button
              className="custom-button alipay"
              type="button"
              onClick={() => onButtonClick("alipay")}
            >
              支付宝支付
            </button>
          </div>
        </div>
      </div>

      <div
        className="custom-template"
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{ __html: template }}
      ></div>
    </div>
  );
};

export default PayCenter;
