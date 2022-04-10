import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setRegisterBoxVisible,
  setTipsBoxVisible,
  setTipsBoxConfig,
} from "../store/globalSlice";
import {
  requestCaptcha,
  requestRegister,
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
  account: "",
  pwd: "",
  confirmPwd: "",
  mobile: "",
  // nickname: "",
  verificationCode: "",
  channelId: "",
  field3: false,
};

const initCaptchaFormData: CaptchaFormData = {
  checkKey: "",
  captcha: "",
};

const Register: React.FC<RegisterProps> = () => {
  const dispatch = useDispatch();
  const [captcha, setCaptcha] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>(
    initRegisterFormData
  );
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [captchaModalVisible, setCaptchaModalVisible] = useState<boolean>(
    false
  );

  const [captchaFormData, setCaptchaFormData] = useState<CaptchaFormData>(
    initCaptchaFormData
  );

  const [phoneCodeLoading, setPhoneCodeLoading] = useState<boolean>(false);
  const [channelListLoading, setChannelListLoading] = useState<boolean>(false);
  const [channelList, setChannelList] = useState<Channel[]>([]);

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
          console.error(res.data.message);
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
    setSubmitting(true);
    requestRegister(params)
      .then((res) => {
        if (res.data.code === 0) {
          dispatch(
            setTipsBoxConfig({
              type: "success",
              title: "操作成功",
              content: "您已成功注册本站会员！",
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
        }
      })
      .finally(() => {
        setSubmitting(false);
        dispatch(setRegisterBoxVisible(false));
      });
  };

  /**
   * 关闭弹窗
   */
  const onClose = () => {
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

    const regExp = /^[\u4e00-\u9fa5]+$/;

    if (!registerFormData.account) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请输入会员名称",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    } else if (
      (regExp.test(registerFormData.account) &&
        registerFormData.account.length < 2) ||
      (!regExp.test(registerFormData.account) &&
        registerFormData.account.length < 4) ||
      registerFormData.account.length > 20
    ) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "用户名必须大于3位小于20位",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    } else if (
      !/^[a-zA-Z0-9@.\u4e00-\u9fa5]+$/g.test(registerFormData.account)
    ) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "用户名不能为特殊字符",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    } else if (!registerFormData.pwd) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请输入登录密码",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    } else if (registerFormData.pwd.length < 4) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "密码必须大于3位",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    } else if (!registerFormData.confirmPwd) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请输入确认密码",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    } else if (registerFormData.pwd !== registerFormData.confirmPwd) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "两次输入的密码不一致",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    } else if (!registerFormData.mobile) {
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
    } else if (!registerFormData.field3) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请先接受服务协议",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    }

    const params: { [propName: string]: any } = {
      nickname: registerFormData.account,
      verificationKey: registerFormData.mobile,
    };
    Object.keys(registerFormData).forEach((key: string) => {
      if (key !== "field3") {
        params[key] = registerFormData[key];
      }
    });
    register(params as RegisterParams);
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
      <div className="ff03">
        <div className="close cursor-pointer" onClick={onClose}>
          <img src={require("../assets/images/icon-16.gif").default} alt="" />
        </div>
        <h1 className="member-l-title">注册会员</h1>
        <div className="reg-table">
          <form onSubmit={onSubmit} autoComplete="off">
            <table className="basic-table" style={{ width: "608px" }}>
              <tbody>
                <tr>
                  <td height="40" colSpan={3} align="center">
                    (带 *
                    号的表示为必填项目，用户名必须大于3位小于20位，密码必须大于3位)
                  </td>
                </tr>
                <tr>
                  <td width="113" height="40" align="right">
                    会员名称&nbsp;&nbsp;&nbsp;
                  </td>
                  <td width="206">
                    <input
                      type="text"
                      name="account"
                      value={registerFormData.account}
                      onChange={onFieldsChange}
                    />
                  </td>
                  <td width="289">
                    <b className="fc1">*</b>{" "}
                    (可以使用中文，但禁止除[@][.]以外的特殊符号)
                  </td>
                </tr>
                {/* <tr>
                  <td height="40" align="right">
                    昵　　称&nbsp;&nbsp;&nbsp;
                  </td>
                  <td>
                    <input
                      type="text"
                      name="nickname"
                      value={registerFormData.nickname}
                      onChange={onFieldsChange}
                    />
                  </td>
                  <td className="f12">
                    <b className="fc1">*</b>
                  </td>
                </tr> */}
                <tr>
                  <td height="40" align="right">
                    登录密码&nbsp;&nbsp;&nbsp;
                  </td>
                  <td>
                    <input
                      type="password"
                      name="pwd"
                      value={registerFormData.pwd}
                      onChange={onFieldsChange}
                    />
                  </td>
                  <td className="f12">
                    <b className="fc1">*</b>
                  </td>
                </tr>
                <tr>
                  <td height="40" align="right">
                    确定密码&nbsp;&nbsp;&nbsp;
                  </td>
                  <td>
                    <input
                      type="password"
                      name="confirmPwd"
                      value={registerFormData.confirmPwd}
                      onChange={onFieldsChange}
                    />
                  </td>
                  <td className="f12">
                    <b className="fc1">*</b>
                  </td>
                </tr>
                {/* <tr>
                  <td height="40" align="right">
                    验证码&nbsp;&nbsp;&nbsp;
                  </td>
                  <td colSpan={2}>
                    <table className="basic-table" style={{ width: "400px" }}>
                      <tbody>
                        <tr>
                          <td width="120">
                            <input
                              style={{ width: "110px" }}
                              type="text"
                              name="verificationCode"
                              value={registerFormData.verificationCode}
                              onChange={onFieldsChange}
                            />
                          </td>
                          <td width="82">
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
                          <td width="198" className="f12">
                            看不清？
                            <span
                              className="fc1 cursor-pointer"
                              onClick={onGetCaptcha}
                            >
                              点击更换
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr> */}
                <tr>
                  <td height="40" align="right">
                    手机号码&nbsp;&nbsp;&nbsp;
                  </td>
                  <td>
                    <input
                      type="text"
                      name="mobile"
                      value={registerFormData.mobile}
                      onChange={onFieldsChange}
                    />
                  </td>
                  <td className="f12" style={{ lineHeight: "36px" }}>
                    <b className="fc1">*</b>
                    <span
                      className="p-yzm cursor-pointer"
                      onClick={onCaptchaModalShow}
                    >
                      获取手机验证码
                    </span>
                  </td>
                </tr>
                <tr>
                  <td height="40" align="right">
                    短信验证码&nbsp;&nbsp;&nbsp;
                  </td>
                  <td>
                    <input
                      type="text"
                      name="verificationCode"
                      value={registerFormData.verificationCode}
                      onChange={onFieldsChange}
                    />
                  </td>
                  <td className="f12">
                    <b className="fc1">*</b>
                  </td>
                </tr>
                <tr>
                  <td height="40" align="right">
                    哪个电台得知本站&nbsp;&nbsp;&nbsp;
                  </td>
                  <td>
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
                  {/* <td className="f12">
                    <b className="fc1">*</b>
                  </td> */}
                </tr>
                <tr>
                  <td height="40" align="right">
                    会员协议&nbsp;&nbsp;&nbsp;
                  </td>
                  <td colSpan={2}>
                    <div className="xy">
                      会员注册协议： <br />
                      1、在本站注册的会员，必须遵守《互联网电子公告服务管理规定》，不得在本站发表诽谤他人，侵犯他人隐私，侵犯他人知识产权，传播病毒，政治言论，商业讯息等信息。
                      <br />
                      2、在所有在本站发表的文章，本站都具有最终编辑权，并且保留用于印刷或向第三方发表的权利，如果你的资料不齐全，我们将有权不作任何通知使用你在本站发布的作品。
                      <br />
                      3、在登记过程中，您将选择注册名和密码。注册名的选择应遵守法律法规及社会公德。您必须对您的密码保密，您将对您注册名和密码下发生的所有活动承担责任。
                    </div>
                  </td>
                </tr>
                <tr>
                  <td height="40">&nbsp;</td>
                  <td colSpan={2}>
                    <label>
                      <input
                        style={{ verticalAlign: "middle" }}
                        type="checkbox"
                        name="field3"
                        checked={registerFormData.field3}
                        onChange={onFieldsChange}
                      />
                      &nbsp;我已阅读并完全接受服务协议
                    </label>
                  </td>
                </tr>
                <tr>
                  <td
                    height="100"
                    colSpan={3}
                    align="center"
                    style={{ borderTop: "1px solid #dddddd" }}
                  >
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