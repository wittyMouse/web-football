import React from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index";
import {
  setLoginBoxVisible,
  setRegisterBoxVisible,
  changeLoginStatus,
} from "../store/globalSlice";
import { requestLogOut } from "../service";

const BasicHeader: React.FC<{}> = () => {
  const { token, userInfo, isLogin } = useSelector(
    (state: RootState) => state.global
  );
  const { nickname, balance, integral } = userInfo;
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  /**
   * 退出
   */
  const logOut = () => {
    requestLogOut(token)
      .then((res) => {
        if (res.data.code === 0) {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("userInfo");
          dispatch(
            changeLoginStatus({
              token: "",
              userInfo: {},
              isLogin: false,
            })
          );
        }
      })
      .finally(() => {});
  };

  /**
   * 跳转用户中心
   */
  const onLink = () => {
    if (location.pathname !== "user-center") {
      history.push("/user-center");
    }
  };

  /**
   * 退出
   */
  const onLogout = () => {
    logOut();
  };

  return (
    <div className="block bg-top">
      <div className="line01">
        <div className="l-top-x block-c clearfix">
          <div className="bg-w"></div>
          <div className="f_l">
            客服热线：<b>400-000-1357</b> (工作时间：周一到周日 11:30-21:00)
          </div>

          {isLogin ? (
            <div className="f_r">
              <span>{nickname}</span>，你好！ 当前金币数量：
              <span>{balance}</span> 当前积分数量：
              <span>{integral}</span>
              &nbsp;&nbsp;
              <input
                className="bat-login cursor-pointer"
                type="button"
                value="用户中心"
                style={{ width: "80px" }}
                onClick={onLink}
              />
              <input
                className="bat-reg cursor-pointer"
                type="button"
                value="退出"
                onClick={onLogout}
              />
            </div>
          ) : (
            <div className="f_r">
              欢迎光临巅峰足球！
              <input
                className="bat-login cursor-pointer"
                type="button"
                value="登录"
                onClick={() => {
                  dispatch(setLoginBoxVisible(true));
                }}
              />
              <input
                className="bat-reg cursor-pointer"
                type="button"
                value="注册"
                onClick={() => {
                  dispatch(setRegisterBoxVisible(true));
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="block-c top-menu clearfix">
        <div className="logo">
          <img src={require("../assets/images/logo.png").default} alt="" />
        </div>
        <div className="f_l">
          <NavLink to="/home" activeClassName="seled">
            <img
              src={require("../assets/images/icon-top-01.png").default}
              alt=""
            />
            网站主页
          </NavLink>
          <NavLink to="/recommend/index" activeClassName="seled">
            <img
              src={require("../assets/images/icon-top-02.png").default}
              alt=""
            />
            王牌推介
          </NavLink>
          <NavLink to="/latest-clue/index" activeClassName="seled">
            <img
              src={require("../assets/images/icon-top-03.png").default}
              alt=""
            />
            贴士专区
          </NavLink>
        </div>
        <div className="f_r">
          <NavLink to="/playback" activeClassName="seled">
            <img
              src={require("../assets/images/icon-top-04.png").default}
              alt=""
            />
            节目回放
          </NavLink>
          <NavLink to="/best-news" activeClassName="seled">
            <img
              src={require("../assets/images/icon-top-05.png").default}
              alt=""
            />
            重大利好
          </NavLink>
          <NavLink to="/ranking-list" activeClassName="seled">
            <img
              src={require("../assets/images/icon-top-06.png").default}
              alt=""
            />
            本周放榜
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default BasicHeader;
