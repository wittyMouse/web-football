import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  setLoginBoxVisible,
} from "../store/globalSlice";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  /**
   * 关闭弹窗
   */
  const onClose = () => {
    dispatch(setLoginBoxVisible(false));
  };

  const wechatRef = useCallback((el) => {
    if (el !== null) {
      wechatInit(el);
    }
  }, []);

  const wechatInit = (el: Element) => {
    const redirectUrl = `${window.location.origin}${window.location.pathname}#/redirect`;
    const callbackUrl = location.pathname + location.search;
    const cssHref = `${window.location.origin}${
      window.location.pathname
    }wechat-qrcode.css?timestramp=${Date.now()}`;
    const stateText = `url=${callbackUrl}&target=login`;
    let state = "";
    for (let i = 0; i < stateText.length; i++) {
      state += stateText.charCodeAt(i).toString(16);
    }
    new WxLogin({
      self_redirect: false,
      id: "wechat-login",
      appid: "wx81b6bd583b6a9ddd",
      scope: "snsapi_login",
      redirect_uri: encodeURIComponent(redirectUrl),
      state,
      style: "block",
      href: encodeURIComponent(cssHref),
    });
  };

  useEffect(() => {
    window.document.body.style.position = "relative";
    window.document.body.style.width = "calc(100% - 17px)";
    window.document.body.style.overflow = "hidden";

    return () => {
      window.document.body.style.position = "";
      window.document.body.style.width = "";
      window.document.body.style.overflow = "";
    };
  }, []);

  return (
    <div>
      <div className="ff06">
        <div className="close cursor-pointer" onClick={onClose}>
          <img src={require("../assets/images/icon-16.gif").default} alt="" />
        </div>
        <h1 className="member-l-title">会员登录</h1>
        <div className="login-img2">
          <div className="login-img-title">微信扫码快速登录</div>
          <div id="wechat-login" ref={wechatRef}></div>
        </div>
      </div>
      <div className="mark-bg"></div>
    </div>
  );
};

export default Login;
