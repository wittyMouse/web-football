import React, { useEffect } from "react";
import "./index.css";

interface ConfirmBox2Props {
  userInfo: any;
  userDetail: any;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmBox2: React.FC<ConfirmBox2Props> = (props) => {
  const onConfirm = () => {
    props.onConfirm();
  };

  const onClose = () => {
    props.onClose();
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
    <div className="confirm-box">
      <div className="ff04">
        <div className="close cursor-pointer" onClick={onClose}>
          <img
            src={require("../../../../assets/images/icon-16.gif").default}
            alt=""
          />
        </div>

        <div className="confirm-box-inner">
          <div className="confirm-box-header">
            <div className="confirm-box-title">提示</div>
          </div>
          <div className="confirm-box-body">
            <div className="confirm-box-content">
              购买该文章需要 {props.userDetail.amount} 金币
            </div>
            <div className="confirm-box-content">
              你目前拥有金币：{props.userInfo.balance} 个
            </div>
          </div>
          <div className="confirm-box-footer">
            <button className="confirm-box-button" onClick={onConfirm}>
              确定
            </button>
          </div>
        </div>
      </div>

      <div className="ff04-mark"></div>
    </div>
  );
};

export default ConfirmBox2;
