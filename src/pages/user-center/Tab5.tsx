import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/index";
import {
  setTipsBoxVisible,
  setTipsBoxConfig,
  setUserInfo,
} from "../../store/globalSlice";
import {
  requestCaptcha,
  requestUpdateProfile,
  requestUserInfo,
} from "../../service";
import { UpdateProfileFormData, UpdateProfileParams } from "../../data";

interface UserCenterTab5Props {}

const initUpdateProfileFormData: UpdateProfileFormData = {
  nickname: "",
  oldPwd: "",
  newPwd: "",
  confirmPwd: "",
  verificationCode: "",
};

const UserCenterTab5: React.FC<UserCenterTab5Props> = () => {
  const { token, userInfo } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();
  const [checkKey, setCheckKey] = useState<string>("");
  const [captcha, setCaptcha] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const [
    updateProfileFormData,
    setUpdateProfileFormData,
  ] = useState<UpdateProfileFormData>(initUpdateProfileFormData);
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
   * 更新会员信息
   * @param params
   */
  const updateProfile = (params: UpdateProfileParams) => {
    setSubmitting(true);
    requestUpdateProfile(params)
      .then((res) => {
        if (res.data.code === 0) {
          dispatch(
            setTipsBoxConfig({
              type: "success",
              title: "操作成功",
              content: res.data.message,
            })
          );
          dispatch(setTipsBoxVisible(true));
          setUpdateProfileFormData(initUpdateProfileFormData);
          requestUserInfo(token).then((res) => {
            if (res.data.code === 0) {
              const userInfo = res.data.result;
              window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
              dispatch(setUserInfo(userInfo));
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
        getCaptcha();
      });
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
    const { name, value } = e.target;
    setUpdateProfileFormData({
      ...updateProfileFormData,
      [name]: value,
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

    const { nickname, newPwd, confirmPwd } = updateProfileFormData;

    if (newPwd !== confirmPwd) {
      // todo
      console.error("两次输入的新密码不相同");
      return;
    }

    const params = {
      ...updateProfileFormData,
      nickname: nickname || (userInfo.nickname as string),
      verificationKey: checkKey,
      token,
    };
    updateProfile(params);
  };

  useEffect(() => {
    getCaptcha();
  }, []);

  return (
    <div className="reg-table">
      <form onSubmit={onSubmit} autoComplete="off">
        <table className="basic-table" style={{ width: "582px" }}>
          <tbody>
            <tr>
              <td height="40" colSpan={3} align="center">
                &nbsp;
              </td>
            </tr>
            <tr>
              <td width="92" height="40" align="right">
                会员名称&nbsp;&nbsp;&nbsp;
              </td>
              <td width="201">{userInfo.account || "-"}</td>
              <td width="289" className="f12">
                &nbsp;
              </td>
            </tr>
            <tr>
              <td height="40" align="right">
                昵　　称&nbsp;&nbsp;&nbsp;
              </td>
              <td>
                <input
                  type="text"
                  name="nickname"
                  placeholder={userInfo.nickname}
                  value={updateProfileFormData.nickname}
                  onChange={onFieldsChange}
                />
              </td>
              <td className="f12">&nbsp;</td>
            </tr>
            <tr>
              <td height="40" align="right">
                原登录密码&nbsp;&nbsp;&nbsp;
              </td>
              <td>
                <input
                  type="password"
                  name="oldPwd"
                  value={updateProfileFormData.oldPwd}
                  onChange={onFieldsChange}
                />
              </td>
              <td className="f12">
                <b className="fc1">*</b>
              </td>
            </tr>
            <tr>
              <td height="40" align="right">
                新密码&nbsp;&nbsp;&nbsp;
              </td>
              <td>
                <input
                  type="password"
                  name="newPwd"
                  value={updateProfileFormData.newPwd}
                  onChange={onFieldsChange}
                />
              </td>
              <td className="f12">(不修改密码请保留此项为空)</td>
            </tr>
            <tr>
              <td height="40" align="right">
                确定新密码&nbsp;&nbsp;&nbsp;
              </td>
              <td>
                <input
                  type="password"
                  name="confirmPwd"
                  value={updateProfileFormData.confirmPwd}
                  onChange={onFieldsChange}
                />
              </td>
              <td className="f12">(不修改密码请保留此项为空)</td>
            </tr>
            <tr>
              <td height="40" align="right">
                验证码&nbsp;&nbsp;&nbsp;
              </td>
              <td colSpan={2}>
                <table className="basic-table" style={{ width: "400px" }}>
                  <tbody>
                    <tr>
                      <td width="120">
                        <input
                          type="text"
                          name="verificationCode"
                          style={{ width: "110px" }}
                          value={updateProfileFormData.verificationCode}
                          onChange={onFieldsChange}
                        />
                      </td>
                      <td width="82">
                        {captchaLoading ? (
                          <div className="captcha-loading">
                            <img
                              src={
                                require("../../assets/images/loading.svg")
                                  .default
                              }
                              alt=""
                            />
                          </div>
                        ) : (
                          <img className="captcha" src={captcha} alt="验证码" />
                        )}
                      </td>
                      <td width="198" className="f12">
                        看不清？
                        <span
                          className="f2 cursor-pointer"
                          onClick={onGetCaptcha}
                        >
                          点击更换
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td height="10" colSpan={3} align="center"></td>
            </tr>
            <tr>
              <td height="100" colSpan={3} align="center">
                <input type="submit" value="提交修改" className="c-bat01" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default UserCenterTab5;
