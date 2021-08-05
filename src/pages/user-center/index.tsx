import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, RouteChildrenProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/index";
import { setTipsBoxConfig, setTipsBoxVisible, setUserInfo } from "../../store/globalSlice";
import CheckInBox from "./components/CheckInBox";
import CheckInCard from "./components/CheckInCard";
import MemberRecharge from "./components/MemberRecharge";
import RechargeBox from "./components/RechargeBox";
import Tabs from "./components/Tabs";
import UserCenterTab1 from "./Tab1";
import UserCenterTab2 from "./Tab2";
import UserCenterTab3 from "./Tab3";
import UserCenterTab4 from "./Tab4";
import UserCenterTab5 from "./Tab5";
import {
  requesCheckInInfo,
  requesCheckIn,
  requestDonateConfigList,
  requestSignInConfigList,
} from "./service";
import { CheckInInfo, CheckInConfig } from "./data";
import { requestAdConfigInfo, requestUserInfo } from "../../service";

interface UserCenterProps extends RouteChildrenProps {}

const UserCenter: React.FC<UserCenterProps> = (props) => {
  const { history } = props;
  const { token, isLogin } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();
  const [checkInInfoLoading, setCheckInInfoLoading] = useState<boolean>(false);
  const [checkInInfo, setCheckInInfo] = useState<CheckInInfo>({
    dayNum: 0,
    integral: 0,
    isSignIn: false,
  });
  const [checkInBoxVisible, setCheckInBoxVisible] = useState<boolean>(false);
  const [checkInLoading, setCheckInLoading] = useState<boolean>(false);
  const [rechargeBoxVisible, setRechargeBoxVisible] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<string>("1");
  const [
    signInConfigListLoading,
    setSignInConfigListLoading,
  ] = useState<boolean>(false);
  const [signInConfigList, setSignInConfigList] = useState<CheckInConfig[]>([]);

  const [
    donateConfigListLoading,
    setDonateConfigListLoading,
  ] = useState<boolean>(false);
  const [donateConfigList, setDonateConfigList] = useState<any>([]);
  const [footerAdv, setFooterAdv] = useState<any>([]);

  /**
   * 获取充值赠送配置
   */
  const getDonateConfigList = () => {
    setDonateConfigListLoading(true);
    requestDonateConfigList()
      .then((res) => {
        if (res.data.code === 0) {
          setDonateConfigList(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setDonateConfigListLoading(false);
      });
  };

  /**
   * 获取签到信息
   */
  const getSignInConfigList = () => {
    setSignInConfigListLoading(true);
    requestSignInConfigList()
      .then((res) => {
        if (res.data.code === 0) {
          setSignInConfigList(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setSignInConfigListLoading(false);
      });
  };

  /**
   * 获取签到信息
   */
  const getCheckInInfo = () => {
    setCheckInInfoLoading(true);
    requesCheckInInfo(token)
      .then((res) => {
        if (res.data.code === 0) {
          setCheckInInfo(res.data.result);
          // setCheckInInfo({ integral: 0, dayNum: 1, isSignIn: true });
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setCheckInInfoLoading(false);
      });
  };

  /**
   * 签到
   */
  const checkIn = () => {
    setCheckInLoading(true);
    requesCheckIn(token)
      .then((res) => {
        if (res.data.code === 0) {
          getCheckInInfo();
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setCheckInLoading(false);
      });
  };

  /**
   * 签到卡片点击事件
   */
  const onCheckInCardClick = () => {
    if (!isLogin) {
      dispatch(
        setTipsBoxConfig({
          type: "error",
          title: "操作失败",
          content: "请先登录",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    }
    setCheckInBoxVisible(true);
  };

  /**
   * 签到弹窗点击事件
   */
  const onCheckInBoxClick = () => {
    if (checkInInfoLoading) {
      return;
    }
    checkIn();
  };

  /**
   * 签到弹窗关闭
   */
  const onCheckInBoxClose = () => {
    setCheckInBoxVisible(false);
  };

  /**
   * 打开充值弹窗
   */
  const onRechargeClick = () => {
    setRechargeBoxVisible(true);
  };

  /**
   * 关闭充值弹窗
   */
  const onRechargeClose = () => {
    getUserInfo()
    setRechargeBoxVisible(false);
  };

  /**
   * 修改价格
   * @param id
   */
  const onPriceChange = (id: string) => {
    setCurrentPrice(id);
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

  const getUserInfo = () => {
    requestUserInfo(token).then((res) => {
      if (res.data.code === 0) {
        const userInfo = res.data.result;
        dispatch(setUserInfo(userInfo));
      }
    })
  }

  useEffect(() => {
    getAdConfigInfo((result) => {
      if (result) {
        if (result[3]) {
          setFooterAdv(result[3]);
        }
      }
    });
  }, []);

  useEffect(() => {
    getDonateConfigList();
    getSignInConfigList();
    if (isLogin) {
      getCheckInInfo();
    } else {
      const token = window.localStorage.getItem("token");
      if (!token) {
        history.replace("/");
      }
    }
  }, [isLogin]);

  return (
    <div>
      {checkInBoxVisible ? (
        <CheckInBox
          loading={checkInLoading}
          signInConfigList={signInConfigList}
          checkInInfo={checkInInfo}
          onCheckIn={onCheckInBoxClick}
          onClose={onCheckInBoxClose}
        />
      ) : null}

      {rechargeBoxVisible ? <RechargeBox onClose={onRechargeClose} /> : null}

      <div className="clearfix block-c member-a">
        <div className="f_l b-right">
          <CheckInCard
            loading={checkInInfoLoading}
            signInConfigList={signInConfigList}
            checkInInfo={checkInInfo}
            onCheckIn={onCheckInCardClick}
          />

          <MemberRecharge
            priceList={donateConfigList}
            currentPrice={currentPrice}
            onPriceChange={onPriceChange}
            onRechargeClick={onRechargeClick}
          />
        </div>
        <div className="f_r b-left b-w box-s">
          <Tabs>
            <Switch>
              <Redirect exact from="/user-center" to="/user-center/tab1" />
              <Route
                path="/user-center/tab1"
                render={(routeProps) => <UserCenterTab1 {...routeProps} />}
              />
              <Route
                path="/user-center/tab2"
                render={(routeProps) => <UserCenterTab2 {...routeProps} />}
              />
              <Route
                path="/user-center/tab3"
                render={(routeProps) => <UserCenterTab3 {...routeProps} />}
              />
              <Route
                path="/user-center/tab4"
                render={(routeProps) => <UserCenterTab4 {...routeProps} />}
              />
              <Route
                path="/user-center/tab5"
                render={(routeProps) => <UserCenterTab5 {...routeProps} />}
              />
            </Switch>
          </Tabs>
        </div>
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

export default UserCenter;
