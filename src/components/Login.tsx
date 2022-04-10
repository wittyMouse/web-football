import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setLoginBoxVisible,
  setRegisterBoxVisible,
  setTipsBoxVisible,
  setTipsBoxConfig,
} from "../store/globalSlice";
import { changeLoginStatus } from "../store/globalSlice";
import {
  requestCaptcha,
  requestLogin,
  requestUserInfo,
  requestLogOut,
} from "../service";
import { LoginFormData, LoginParams } from "../data";

interface LoginProps {}

const initLoginFormData: LoginFormData = {
  account: "",
  pwd: "",
  captcha: "",
  type: 0,
};

const Login: React.FC<LoginProps> = () => {
  const dispatch = useDispatch();
  const [checkKey, setCheckKey] = useState<string>("");
  const [captcha, setCaptcha] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const [loginFormData, setLoginFormData] = useState<LoginFormData>(
    initLoginFormData
  );
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 获取验证码
   */
  const getCaptcha = () => {
    const timestamp = Date.now().toString();
    setCheckKey(timestamp);
    setCaptchaLoading(true);
    requestCaptcha(timestamp)
      .then((res) => {
        if (res.data.code === 0) {
          setCaptcha(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setCaptchaLoading(false);
      });
  };

  /**
   * 登录
   * @param params
   */
  const login = (params: LoginParams) => {
    setSubmitting(true);
    requestLogin(params)
      .then((res) => {
        if (res.data.code === 0) {
          const token = res.data.result;
          requestUserInfo(token).then((res) => {
            if (res.data.code === 0) {
              const userInfo = res.data.result;
              window.localStorage.setItem("token", token);
              window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
              dispatch(
                changeLoginStatus({
                  token,
                  userInfo,
                  isLogin: true,
                })
              );
              dispatch(
                setTipsBoxConfig({
                  type: "success",
                  title: "操作成功",
                  content: "登录成功",
                })
              );
              dispatch(setTipsBoxVisible(true));
            } else {
              dispatch(
                setTipsBoxConfig({
                  type: "error",
                  title: "操作失败",
                  content: res.data.message,
                })
              );
              dispatch(setTipsBoxVisible(true));
              requestLogOut(token);
              getCaptcha();
            }
          });
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
        setSubmitting(false);
        dispatch(setLoginBoxVisible(false));
      });
  };

  /**
   * 关闭弹窗
   */
  const onClose = () => {
    dispatch(setLoginBoxVisible(false));
  };

  /**
   * 打开注册弹窗
   */
  const onRegister = () => {
    dispatch(setLoginBoxVisible(false));
    dispatch(setRegisterBoxVisible(true));
  };

  /**
   * 打开忘记密码弹窗
   */
  const onForGotPassword = () => {
    dispatch(setLoginBoxVisible(false));
    dispatch(
      setTipsBoxConfig({
        type: "warning",
        title: "忘记密码",
        content: (
          <>
            请您联系本站客服人员！
            <br />
            服务热线：
            <b className="fc1" style={{ fontSize: "16px" }}>
              400-000-1357
            </b>
          </>
        ),
      })
    );
    dispatch(setTipsBoxVisible(true));
  };

  /**
   * 刷新验证码
   */
  const onGetCaptcha = () => {
    getCaptcha();
  };

  /**
   * 表单值变更事件
   * @param e
   */
  const onFieldsChange = (e: any) => {
    const { type, name, value } = e.target;
    switch (type) {
      case "radio":
        setLoginFormData((loginFormData) => ({
          ...loginFormData,
          [name]: Number(value),
        }));
        break;
      default:
        setLoginFormData((loginFormData) => ({
          ...loginFormData,
          [name]: value,
        }));
        break;
    }
  };

  /**
   * 提交表单
   * @param e
   */
  const onSubmit = (e: any) => {
    // 阻止表单默认事件
    e.preventDefault();

    if (submitting) {
      return;
    }

    if (!loginFormData.account) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请输入会员账号",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    } else if (!loginFormData.pwd) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请输入登录密码",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    } else if (!loginFormData.captcha) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请输入验证码",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    }

    const { account, pwd, captcha, type } = loginFormData;

    const params = {
      account,
      pwd,
      verificationKey: checkKey,
      verificationCode: captcha as string,
      type,
    };
    login(params);
  };

  useEffect(() => {
    window.document.body.style.position = "relative";
    window.document.body.style.width = "calc(100% - 17px)";
    window.document.body.style.overflow = "hidden";

    getCaptcha();

    return () => {
      window.document.body.style.position = "";
      window.document.body.style.width = "";
      window.document.body.style.overflow = "";
    };
  }, []);

  return (
    <div>
      <div className="ff02">
        <div className="close cursor-pointer" onClick={onClose}>
          <img src={require("../assets/images/icon-16.gif").default} alt="" />
        </div>
        <h1 className="member-l-title">会员登录</h1>

        <div className="login-table">
          <form onSubmit={onSubmit} autoComplete="off">
            <table className="basic-table" style={{ width: "266px" }}>
              <tbody>
                <tr>
                  <td valign="top" height="48">
                    <input
                      type="text"
                      name="account"
                      className="m-yh m-input"
                      placeholder="会员账号"
                      value={loginFormData.account}
                      onChange={onFieldsChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td valign="top" height="44">
                    <input
                      type="password"
                      name="pwd"
                      className="m-ma m-input"
                      placeholder="登录密码"
                      value={loginFormData.pwd}
                      onChange={onFieldsChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td height="48">
                    <table className="basic-table" style={{ width: "266px" }}>
                      <tbody>
                        <tr>
                          <td width="65">
                            <input
                              type="text"
                              name="captcha"
                              className="l-inp-bg03"
                              value={loginFormData.captcha}
                              onChange={onFieldsChange}
                            />
                          </td>
                          <td width="77">
                            {captchaLoading ? (
                              <div className="captcha-loading">
                                <img
                                  src={
                                    require("../assets/images/loading.svg")
                                      .default
                                  }
                                  alt=""
                                />
                              </div>
                            ) : (
                              <img
                                className="captcha"
                                src={captcha}
                                alt="验证码"
                              />
                            )}
                          </td>
                          <td width="124">
                            看不清？
                            <span
                              className="f2 cursor-pointer"
                              onClick={onGetCaptcha}
                            >
                              点击更换
                            </span>
                            {/* <span className="fc1 cursor-pointer">点击更换</span> */}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td height="52" className="yx-label">
                    有效期：
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value={2}
                        checked={loginFormData.type === 2}
                        onChange={onFieldsChange}
                      />
                      一个月
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value={1}
                        checked={loginFormData.type === 1}
                        onChange={onFieldsChange}
                      />
                      一周
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value={0}
                        checked={loginFormData.type === 0}
                        onChange={onFieldsChange}
                      />
                      一天
                    </label>
                  </td>
                </tr>
                <tr>
                  <td align="center" className="p-r">
                    <div className="forget">
                      <span
                        className="cursor-pointer"
                        onClick={onForGotPassword}
                      >
                        忘记密码？
                      </span>
                    </div>
                    <input
                      type="submit"
                      value="确定提交"
                      className="m-buttton cursor-pointer"
                    />
                  </td>
                </tr>
                <tr>
                  <td height="72" align="center">
                    <span
                      className="reg-t-b cursor-pointer"
                      onClick={onRegister}
                    >
                      立即注册，享受巅峰！
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
      <div className="mark-bg"></div>
    </div>
  );
};

export default Login;