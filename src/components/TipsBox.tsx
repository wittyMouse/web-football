import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setTipsBoxVisible } from "../store/globalSlice";

interface TipsBoxProps {}

const TipsBox: React.FC<TipsBoxProps> = () => {
  const dispatch = useDispatch();
  const { tipsBoxConfig } = useSelector((state: RootState) => state.global);

  const { type, title, content } = tipsBoxConfig;

  /**
   * 获取提示弹窗图标
   * @param type
   */
  const getTipsIcon = (type: string) => {
    let iconName = "";
    switch (type) {
      case "success":
        iconName = "icon-15";
        break;
      case "warning":
        iconName = "icon-17";
        break;
      case "error":
        iconName = "icon-18";
        break;
    }
    return iconName;
  };

  const _onClose = () => {
    dispatch(setTipsBoxVisible(false));
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
      <div className="ff04">
        <div className="close cursor-pointer" onClick={_onClose}>
          <img src={require("../assets/images/icon-16.gif").default} />
        </div>
        <table className="basic-table" style={{ width: "428px" }}>
          <tbody>
            <tr>
              <td height="156" align="center" valign="bottom">
                <img
                  src={
                    require(`../assets/images/${getTipsIcon(type)}.gif`).default
                  }
                />
              </td>
            </tr>
            <tr>
              <td height="66" align="center" style={{ fontSize: "24px" }}>
                {title}
              </td>
            </tr>
            <tr>
              <td height="88" align="center" valign="top">
                {content}
              </td>
            </tr>
            <tr>
              <td align="center">
                <input
                  className="c-bat01"
                  type="button"
                  value="关闭"
                  onClick={_onClose}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="ff04-mark"></div>
    </div>
  );
};

export default TipsBox;
