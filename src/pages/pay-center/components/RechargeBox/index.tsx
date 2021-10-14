import React from "react";
import QRCode from "qrcode.react";
import "./index.css";

interface RechargeBoxProps {
  value: string;
  onClose: () => void;
}

const RechargeBox: React.FC<RechargeBoxProps> = (props) => {
  return (
    <div>
      <div className="ff05">
        <div className="close cursor-pointer" onClick={props.onClose}>
          <img
            src={require("../../../../assets/images/icon-16.gif").default}
            alt=""
          />
        </div>
        <div className="custom-box">
          <div className="custom-box__header">微信扫码充值</div>
          <div className="custom-box__content">
            <QRCode value={props.value} size={240} />
          </div>
          <div className="custom-box__footer">请用手机“微信APP”的发现扫一扫，完成充值！</div>
        </div>
      </div>
      <div className="mark-bg"></div>
    </div>
  );
};

export default RechargeBox;
