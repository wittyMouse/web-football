import React from "react";

interface PayCardProps {
  articleDetail: any;
  onPayClick: (articleId: string) => void;
}

const PayCard: React.FC<PayCardProps> = (props) => {
  const { articleDetail, onPayClick } = props;

  return (
    <div className="b-cont">
      <div className="b-c-tishi">
        这篇文档需要 <b>{articleDetail.amount}</b> 金币 才能访问
        <br />
        <div className="b-login">
          <table className="basic-table" style={{ width: "270px" }}>
            <tbody>
              <tr>
                <td height="60">
                  <input
                    type="button"
                    value="确定购买"
                    className="m-buttton cursor-pointer"
                    onClick={() => onPayClick(articleDetail.articleId)}
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

export default PayCard;
