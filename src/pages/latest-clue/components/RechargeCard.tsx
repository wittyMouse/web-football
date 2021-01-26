import React from "react";

interface UnpayCardProps {
  articleDetail: any;
  userInfo: any;
  onRechargeClick: () => void;
}

const UnpayCard: React.FC<UnpayCardProps> = (props) => {
  const { articleDetail, userInfo, onRechargeClick } = props;

  return (
    <div className="b-cont">
      <div className="b-c-tishi">
        这篇文档需要 <b>{articleDetail.amount}</b> 金币 才能访问
        <br />
        你的金币现有 {userInfo.balance}，
        <span className="fc1">不足购买，请先充值</span>
        <div className="b-login">
          <table className="basic-table" style={{ width: "270px" }}>
            <tbody>
              <tr>
                <td height="60">
                  <input
                    type="button"
                    value="去充值"
                    className="m-buttton cursor-pointer"
                    onClick={onRechargeClick}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UnpayCard;
