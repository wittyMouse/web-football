import React, { useState, useEffect } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/index";
import {
  setTipsBoxVisible,
  setTipsBoxConfig,
  setUserInfo,
} from "../../store/globalSlice";
import { requestUserInfo, requestBatchSubscribe } from "./service";
import { OrderMap } from "./data";
import { requestAdConfigInfo } from "../../service";

interface CheckOrderProps extends RouteChildrenProps {}

const CheckOrder: React.FC<CheckOrderProps> = (props) => {
  const { history } = props;
  const { token, isLogin, userInfo } = useSelector(
    (state: RootState) => state.global
  );
  const dispatch = useDispatch();

  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(false); // 获取用户信息加载状态
  const [subscribeLoading, setSubscribeLoading] = useState<boolean>(false); // 订阅请求加载状态
  const [orderList, setOrderList] = useState<any[]>([]); // 订单列表
  const [total, setTotal] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [headerAdv, setHeaderAdv] = useState<any>([]);
  const [footerAdv, setFooterAdv] = useState<any>([]);

  const orderMap: OrderMap = {
    0: {
      label: "单日",
      dataIndex: "dayAmount",
      unit: "金币",
    },
    1: {
      label: "包周",
      dataIndex: "weekAmount",
      unit: "金币",
    },
    3: {
      label: "单日积分",
      dataIndex: "dayAmount",
      unit: "积分",
    },
  };

  // 获取用户信息
  const gettUserInfo = (cb: (userInfo: any) => void) => {
    setUserInfoLoading(true);
    requestUserInfo(token)
      .then((res) => {
        if (res.data.code === 0) {
          const _userInfo = res.data.result;
          window.localStorage.setItem("userInfo", JSON.stringify(_userInfo));
          dispatch(setUserInfo(_userInfo));
          cb && cb(_userInfo);
        } else {
          dispatch(
            setTipsBoxConfig({
              type: "error",
              title: "操作失败",
              content: "无法获取用户余额，请重试",
            })
          );
          dispatch(setTipsBoxVisible(true));
        }
      })
      .finally(() => {
        setUserInfoLoading(false);
      });
  };

  // 批量至尊推介订购
  const batchSubscribe = (cb: () => void) => {
    setSubscribeLoading(true);
    const subscribeList = orderList.map((item) => {
      const { id, type } = item;
      return { userId: id, type };
    });
    const params = {
      subscribeList,
      token,
    };

    requestBatchSubscribe(params)
      .then((res) => {
        if (res.data.code === 0) {
          cb && cb();
        } else {
          dispatch(
            setTipsBoxConfig({
              type: "error",
              title: "操作失败",
              content: res.data.message,
            })
          );
          dispatch(setTipsBoxVisible(true));
        }
      })
      .finally(() => {
        setSubscribeLoading(false);
      });
  };

  // 支付按钮
  const onPayClick = () => {
    if (subscribeLoading) {
      return;
    }
    gettUserInfo((userInfo: any) => {
      const { balance, integral } = userInfo;
      if (total - balance > 0) {
        dispatch(
          setTipsBoxConfig({
            type: "error",
            title: "操作失败",
            content: "金币不足",
          })
        );
        dispatch(setTipsBoxVisible(true));
      } else if (totalPoints - integral > 0) {
        dispatch(
          setTipsBoxConfig({
            type: "error",
            title: "操作失败",
            content: "积分不足",
          })
        );
        dispatch(setTipsBoxVisible(true));
      } else {
        batchSubscribe(() => {
          window.sessionStorage.setItem("paySuccess", "1");
          history.replace("/latest-clue/order-success");
        });
      }
    });
  };

  const getAdConfigInfo = (cb: (result: any) => void) => {
    requestAdConfigInfo().then((res) => {
      if (res.data.code === 0) {
        cb && cb(res.data.result);
      } else {
        console.error(res.data.message);
      }
    });
  };

  useEffect(() => {
    getAdConfigInfo((result) => {
      if (result) {
        if (result[2]) {
          setHeaderAdv(result[2]);
        }
        if (result[3]) {
          setFooterAdv(result[3]);
        }
      }
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(
        setTipsBoxConfig({
          type: "error",
          title: "操作失败",
          content: "请先登录",
        })
      );
      dispatch(setTipsBoxVisible(true));

      setTimeout(() => {
        history.goBack();
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (isLogin) {
      const selectedOrderIds = window.sessionStorage.getItem(
        "selectedOrderIds"
      );
      let _orderList: any = window.localStorage.getItem(
        `${userInfo.id}-orderList`
      );
      if (selectedOrderIds && _orderList) {
        _orderList = JSON.parse(_orderList);
        _orderList = _orderList.filter((item: any) =>
          selectedOrderIds.split(",").includes(item.id)
        );

        // 计算总金额
        let total = 0;
        let totalPoints = 0;
        _orderList.forEach((item: any) => {
          const { type, dayAmount, weekAmount } = item;
          if (type === 0 || type === 1) {
            total += type === 0 ? dayAmount : weekAmount;
          } else if (type === 3) {
            totalPoints += dayAmount * 10;
          }
        });

        setOrderList(_orderList);
        setTotal(total);
        setTotalPoints(totalPoints);
      } else {
        dispatch(
          setTipsBoxConfig({
            type: "error",
            title: "操作失败",
            content: "没有选中的订单",
          })
        );
        dispatch(setTipsBoxVisible(true));

        setTimeout(() => {
          history.goBack();
        }, 0);
      }
    } else {
      // 退出后弹出提示，返回上一页
      dispatch(
        setTipsBoxConfig({
          type: "error",
          title: "操作失败",
          content: "请先登录",
        })
      );
      dispatch(setTipsBoxVisible(true));

      setTimeout(() => {
        history.goBack();
      }, 0);
    }
  }, [isLogin]);

  return (
    <div>
      <div className="top-gg box-s">
        <img
          className="cursor-pointer"
          src={headerAdv && headerAdv.length > 0 ? headerAdv[0].imageUrl : ""}
          alt="adv"
          onClick={() => {
            if (headerAdv[0].pageUrl) {
              window.location.href = headerAdv[0].pageUrl;
            }
          }}
        />
      </div>

      <div className="cart-bg">
        <h1>确认订单</h1>
        <table className="basic-table" style={{ width: "80%" }}>
          <tbody>
            <tr>
              <th style={{ width: "58%", height: "40px" }}>专家名称</th>
              <th style={{ width: "20%" }}>服务类型</th>
              <th style={{ width: "17%" }}>金币/积分</th>
            </tr>
            {orderList?.map((item: any) => {
              const { id, realname, avatar, price, type } = item;

              return (
                <tr key={id}>
                  <td style={{ height: "80px" }}>
                    <dl>
                      <dd>
                        <img src={avatar} />
                      </dd>
                      <dt>{realname}</dt>
                    </dl>
                  </td>
                  <td>{orderMap[type].label}</td>
                  <td>
                    {type === 3
                      ? item[orderMap[type].dataIndex] * 10
                      : item[orderMap[type].dataIndex]}
                    {orderMap[type].unit}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td style={{ height: "60px" }} colSpan={3} className="clearfix">
                <div className="f_l">
                  共 {orderList.length} 个服务，总计：
                  <b className="fc1">{total}</b>金币、
                  <b>{totalPoints}</b>积分
                </div>
                <div className="f_r">
                  <a className="bat-js cursor-pointer" onClick={onPayClick}>
                    确定支付
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="foot-gg box-s">
        <img
          className="cursor-pointer"
          src={footerAdv && footerAdv.length > 0 ? footerAdv[0].imageUrl : ""}
          alt="adv"
          onClick={() => {
            if (footerAdv[0].pageUrl) {
              window.location.href = footerAdv[0].pageUrl;
            }
          }}
        />
      </div>
    </div>
  );
};

export default CheckOrder;
