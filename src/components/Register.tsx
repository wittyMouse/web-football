import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index";
import { useLocation } from "react-router-dom";
import {
  setRegisterBoxVisible,
  setTipsBoxVisible,
  setTipsBoxConfig,
  setRegisterStatus,
  changeLoginStatus,
} from "../store/globalSlice";
import {
  requestCaptcha,
  requestEditMemberInfo,
  requestPhoneCode,
  requestChannelList,
} from "../service";
import {
  RegisterFormData,
  RegisterParams,
  RequestPhoneCodeParams,
  CaptchaFormData,
} from "../data";
import Modal from "./Modal";

interface RegisterProps {}

interface Channel {
  channelId?: string;
  channelName?: string;
  createDate?: string;
  id?: string;
}

const initRegisterFormData: RegisterFormData = {
  // account: "",
  // pwd: "",
  // confirmPwd: "",
  mobile: "",
  // nickname: "",
  verificationCode: "",
  channelId: "",
  // field3: false,
};

const initCaptchaFormData: CaptchaFormData = {
  checkKey: "",
  captcha: "",
};

const Register: React.FC<RegisterProps> = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [captcha, setCaptcha] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const [registerFormData, setRegisterFormData] =
    useState<RegisterFormData>(initRegisterFormData);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [captchaModalVisible, setCaptchaModalVisible] =
    useState<boolean>(false);

  const [captchaFormData, setCaptchaFormData] =
    useState<CaptchaFormData>(initCaptchaFormData);

  const [phoneCodeLoading, setPhoneCodeLoading] = useState<boolean>(false);
  const [channelListLoading, setChannelListLoading] = useState<boolean>(false);
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const { registerStatus } = useSelector((state: RootState) => state.global);

  /**
   * 获取验证码
   */
  const getCaptcha = (params: { mobile: string }, cb?: () => void) => {
    setCaptchaLoading(true);
    requestCaptcha(params.mobile)
      .then((res) => {
        if (res.data.code === 0) {
          setCaptcha(res.data.result);
          cb && cb();
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setCaptchaLoading(false);
      });
  };

  /**
   * 获取手机验证码
   */
  const getPhoneCode = (params: RequestPhoneCodeParams, cb: () => void) => {
    setPhoneCodeLoading(true);
    requestPhoneCode(params)
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
          onCaptchaModalClose();
        }
      })
      .finally(() => {
        setPhoneCodeLoading(false);
      });
  };

  /**
   * 获取渠道列表
   */
  const getChannelList = () => {
    setChannelListLoading(true);
    requestChannelList()
      .then((res) => {
        if (res.data.code === 0) {
          setChannelList(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setChannelListLoading(false);
      });
  };

  /**
   * 注册
   * @param params
   */
  const register = (params: RegisterParams) => {
    const token = window.sessionStorage.getItem("register-token") as string;
    setSubmitting(true);
    requestEditMemberInfo({ ...params, token })
      .then((res) => {
        if (res.data.code === 0) {
          // dispatch(
          //   setTipsBoxConfig({
          //     type: "success",
          //     title: "操作成功",
          //     content: "您已成功注册本站会员！",
          //   })
          // );
          // dispatch(setTipsBoxVisible(true));
          const userInfo = JSON.parse(
            window.sessionStorage.getItem("register-userInfo") as string
          );

          dispatch(changeLoginStatus({
            token,
            userInfo,
            isLogin: true,
          }));

          window.sessionStorage.removeItem("register-token");
          window.sessionStorage.removeItem("register-userInfo");
          dispatch(setRegisterStatus(3));
        } else {
          dispatch(setRegisterBoxVisible(false));
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
      });
  };

  /**
   * 关闭弹窗
   */
  const onClose = () => {
    dispatch(setRegisterBoxVisible(false));
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
      id: "wechat-register",
      appid: "wx81b6bd583b6a9ddd",
      scope: "snsapi_login",
      redirect_uri: encodeURIComponent(redirectUrl),
      state,
      style: "block",
      href: encodeURIComponent(cssHref),
    });
  };

  const onBackClick = () => {
    dispatch(setRegisterBoxVisible(false));
  };

  /**
   * 表单值变更事件
   * @param e
   */
  const onFieldsChange = (e: any) => {
    const { type, name, value, checked } = e.target;
    switch (type) {
      case "checkbox":
        setRegisterFormData({
          ...registerFormData,
          [name]: checked,
        });
        break;
      default:
        setRegisterFormData({
          ...registerFormData,
          [name]: value,
        });
        break;
    }
  };

  /**
   * 显示获取手机验证码弹窗
   */
  const onCaptchaModalShow = () => {
    const { mobile } = registerFormData;

    if (!mobile) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请输入手机号码",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    }

    getCaptcha({ mobile }, () => {
      setCaptchaFormData({
        ...captchaFormData,
        checkKey: mobile,
      });
      setCaptchaModalVisible(true);
    });
  };

  /**
   * 关闭获取手机验证码弹窗
   */
  const onCaptchaModalClose = () => {
    setCaptchaModalVisible(false);
    setCaptchaFormData(initCaptchaFormData);
  };

  /**
   * 更新验证码
   */
  const onCaptchaUpdate = () => {
    const { mobile } = registerFormData;

    getCaptcha({ mobile });
  };

  /**
   * 获取手机验证码弹窗输入框输入事件
   * @param e
   */
  const onCaptchaFormInput = (e: any) => {
    const { name, value } = e.target;
    setCaptchaFormData({
      ...captchaFormData,
      [name]: value,
    });
  };

  /**
   * 提交获取手机验证码表单
   */
  const onCaptchaFormSubmit = () => {
    const { captcha } = captchaFormData;
    if (!captcha) {
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

    if (phoneCodeLoading) {
      return;
    }

    const params = {
      ...captchaFormData,
    };

    getPhoneCode(params, () => {
      dispatch(
        setTipsBoxConfig({
          type: "success",
          title: "操作成功",
          content: "验证码已发送",
        })
      );
      dispatch(setTipsBoxVisible(true));
      onCaptchaModalClose();
    });
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

    // const regExp = /^[\u4e00-\u9fa5]+$/;

    // if (!registerFormData.account) {
    //   dispatch(
    //     setTipsBoxConfig({
    //       type: "warning",
    //       title: "提示",
    //       content: "请输入会员名称",
    //     })
    //   );
    //   dispatch(setTipsBoxVisible(true));
    //   return;
    // } else if (
    //   (regExp.test(registerFormData.account) &&
    //     registerFormData.account.length < 2) ||
    //   (!regExp.test(registerFormData.account) &&
    //     registerFormData.account.length < 4) ||
    //   registerFormData.account.length > 20
    // ) {
    //   dispatch(
    //     setTipsBoxConfig({
    //       type: "warning",
    //       title: "提示",
    //       content: "用户名必须大于3位小于20位",
    //     })
    //   );
    //   dispatch(setTipsBoxVisible(true));
    //   return;
    // } else if (
    //   !/^[a-zA-Z0-9@.\u4e00-\u9fa5]+$/g.test(registerFormData.account)
    // ) {
    //   dispatch(
    //     setTipsBoxConfig({
    //       type: "warning",
    //       title: "提示",
    //       content: "用户名不能为特殊字符",
    //     })
    //   );
    //   dispatch(setTipsBoxVisible(true));
    //   return;
    // } else if (!registerFormData.pwd) {
    //   dispatch(
    //     setTipsBoxConfig({
    //       type: "warning",
    //       title: "提示",
    //       content: "请输入登录密码",
    //     })
    //   );
    //   dispatch(setTipsBoxVisible(true));
    //   return;
    // } else if (registerFormData.pwd.length < 4) {
    //   dispatch(
    //     setTipsBoxConfig({
    //       type: "warning",
    //       title: "提示",
    //       content: "密码必须大于3位",
    //     })
    //   );
    //   dispatch(setTipsBoxVisible(true));
    //   return;
    // } else if (!registerFormData.confirmPwd) {
    //   dispatch(
    //     setTipsBoxConfig({
    //       type: "warning",
    //       title: "提示",
    //       content: "请输入确认密码",
    //     })
    //   );
    //   dispatch(setTipsBoxVisible(true));
    //   return;
    // } else if (registerFormData.pwd !== registerFormData.confirmPwd) {
    //   dispatch(
    //     setTipsBoxConfig({
    //       type: "warning",
    //       title: "提示",
    //       content: "两次输入的密码不一致",
    //     })
    //   );
    //   dispatch(setTipsBoxVisible(true));
    //   return;
    // } else if (!registerFormData.mobile) {
    //   dispatch(
    //     setTipsBoxConfig({
    //       type: "warning",
    //       title: "提示",
    //       content: "请输入手机号",
    //     })
    //   );
    //   dispatch(setTipsBoxVisible(true));
    //   return;
    // } else if (!registerFormData.verificationCode) {
    //   dispatch(
    //     setTipsBoxConfig({
    //       type: "warning",
    //       title: "提示",
    //       content: "请输入验证码",
    //     })
    //   );
    //   dispatch(setTipsBoxVisible(true));
    //   return;
    // } else if (!registerFormData.field3) {
    //   dispatch(
    //     setTipsBoxConfig({
    //       type: "warning",
    //       title: "提示",
    //       content: "请先接受服务协议",
    //     })
    //   );
    //   dispatch(setTipsBoxVisible(true));
    //   return;
    // }

    if (!registerFormData.mobile) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请输入手机号",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    } else if (!registerFormData.verificationCode) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请输入验证码",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    } else if (!registerFormData.channelId) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请选择得知渠道",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    }

    // const params: { [propName: string]: any } = {
    //   nickname: registerFormData.account,
    //   verificationKey: registerFormData.mobile,
    // };
    // Object.keys(registerFormData).forEach((key: string) => {
    //   if (key !== "field3") {
    //     params[key] = registerFormData[key];
    //   }
    // });

    const params: { [propName: string]: any } = {
      ...registerFormData,
    };
    register(params as RegisterParams);
  };

  const registerRender = () => {
    if (registerStatus === 1) {
      // 扫码
      return (
        <div className="wx-reg2">
          <img src={require("../assets/images/wx-reg.gif").default} alt="" />
          <p>微信扫码关注注册</p>
          <div id="wechat-register" ref={wechatRef}></div>
        </div>
      );
    } else if (registerStatus === 2) {
      // 填写信息
      return (
        <div className="wx-reg2">
          <div className="reg-bz">
            <ul>
              <li className="seled">
                <span>1</span>验证手机号
              </li>
              <li>
                <span>2</span>注册成功
              </li>
            </ul>
          </div>
          <form onSubmit={onSubmit} autoComplete="off">
            <table className="basic-table reg-table2">
              <tbody>
                <tr>
                  <td width="92" height="40" align="right">
                    手机号码&nbsp;&nbsp;&nbsp;
                  </td>
                  <td align="left">
                    <input
                      type="text"
                      name="mobile"
                      value={registerFormData.mobile}
                      onChange={onFieldsChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td height="40" align="right">
                    短信验证码&nbsp;&nbsp;&nbsp;
                  </td>
                  <td align="left">
                    <input
                      style={{ width: "100px" }}
                      type="text"
                      placeholder="输入验证码"
                      name="verificationCode"
                      value={registerFormData.verificationCode}
                      onChange={onFieldsChange}
                    />
                    <span className="f12" style={{ lineHeight: "36px" }}>
                      &nbsp;&nbsp;
                      <span
                        className="p-yzm cursor-pointer"
                        style={{ color: "#ff5500" }}
                        onClick={onCaptchaModalShow}
                      >
                        获取手机验证码
                      </span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td height="40" align="right">
                    得知渠道&nbsp;&nbsp;&nbsp;
                  </td>
                  <td align="left">
                    <select
                      name="channelId"
                      value={registerFormData.channelId}
                      onChange={onFieldsChange}
                    >
                      <option value="">请选择</option>
                      {channelList.map((item) => (
                        <option value={item.channelId} key={item.channelId}>
                          {item.channelName}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td height="8" colSpan={2} align="right"></td>
                </tr>
                <tr>
                  <td height="80" colSpan={2} align="center">
                    <input
                      type="submit"
                      value="确定提交"
                      className="m-buttton cursor-pointer"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      );
    } else if (registerStatus === 3) {
      // 成功
      return (
        <div className="wx-reg2">
          <div className="reg-bz">
            <ul>
              <li className="seled">
                <span>1</span>验证手机号
              </li>
              <li className="seled">
                <span>2</span>注册成功
              </li>
            </ul>
          </div>
          <div className="reg-suc">
            <img src={require("../assets/images/icon-15.gif").default} alt="" />
            <h2>注册成功</h2>
            <p>已自动登录</p>
            <div>
              <input
                className="m-buttton cursor-pointer"
                type="button"
                value="确定提交"
                onClick={onBackClick}
              />
            </div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    window.document.body.style.position = "relative";
    window.document.body.style.width = "calc(100% - 17px)";
    window.document.body.style.overflow = "hidden";
    getChannelList();

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
        <h1 className="member-l-title">注册会员</h1>
        {registerRender()}
      </div>

      <Modal
        visible={captchaModalVisible}
        captchaSrc={captcha}
        captchaFormData={captchaFormData}
        onCaptchaUpdate={onCaptchaUpdate}
        onInput={onCaptchaFormInput}
        onSubmit={onCaptchaFormSubmit}
        onClose={onCaptchaModalClose}
      />
      <div className="mark-bg"></div>
    </div>
  );
};

export default Register;
