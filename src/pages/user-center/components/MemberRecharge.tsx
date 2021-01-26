import React from "react";

interface Price {
  createDate: string;
  donateIntegral: number;
  id: string;
  rechargeAmount: number;
  type: number;
}
interface MemberRechargeProps {
  priceList: Price[];
  currentPrice: string;
  onPriceChange: (id: string) => void;
  onRechargeClick: () => void;
}

const typeMap = ["积分", "金币"];

const MemberRecharge: React.FC<MemberRechargeProps> = (props) => {
  const { priceList, currentPrice, onPriceChange, onRechargeClick } = props;

  return (
    <div className="box-s b-w pading-1">
      <h1 className="title-bg02 h-bg14">会员快速充值</h1>
      <div className="zz-cont">
        <table className="basic-table buy-g" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <th style={{ width: "36%", textAlign: "center" }}>金币数量</th>
              <th style={{ width: "32%", textAlign: "center" }}>价格（元）</th>
              <th style={{ width: "32%", textAlign: "center" }}>赠送</th>
            </tr>
            {priceList.map((item: Price, index: number) => {
              const { id, rechargeAmount, donateIntegral, type } = item;

              return (
                <tr key={index}>
                  <td>
                    <label>
                      <input
                        name="recharge"
                        type="radio"
                        value={id}
                        checked={currentPrice === id}
                        onChange={() => {
                          onPriceChange(id);
                        }}
                      />
                      {rechargeAmount}个
                    </label>
                  </td>
                  <td align="center">{rechargeAmount}</td>
                  <td align="center">
                    {donateIntegral}&nbsp;
                    <span style={{ fontSize: "12px" }}>({typeMap[type]})</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="buy-bat">
          <input type="button" value="确定购买" onClick={onRechargeClick} />
        </div>
      </div>
    </div>
  );
};

export default MemberRecharge;
