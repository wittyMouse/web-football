import React from "react";

interface RechargeBoxProps {
  onClose: () => void;
}

const RechargeBox: React.FC<RechargeBoxProps> = (props) => {
  const { onClose } = props;

  return (
    <div>
      <div className="ff05">
        <div className="close cursor-pointer" onClick={onClose}>
          <img src={require("../../../assets/images/icon-16.gif").default} />
        </div>
        <img
          className="recharge-image"
          src={`https://www.df1668.com/upload/image/QR/QR.jpg?timestamp=${Date.now()}`}
        />
      </div>
      <div className="mark-bg"></div>
    </div>
  );
};

export default RechargeBox;
