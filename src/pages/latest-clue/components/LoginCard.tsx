import React from "react";

interface LoginCardProps {
  articleDetail: any;
  onLoginClick: () => void;
}

const LoginCard: React.FC<LoginCardProps> = (props) => {
  const { articleDetail, onLoginClick } = props;

  return (
    <div className="b-cont">
      <div className="b-c-tishi">
        这篇文档需要 <b>{articleDetail.amount}</b> 金币 才能访问
        <br />
        请先&nbsp;
        <span className="fc1">登录</span>
        <div className="b-login">
          <table className="basic-table" style={{ width: "270px" }}>
            <tbody>
              <tr>
                <td height="60">
                  <input
                    type="button"
                    value="登录"
                    className="m-buttton cursor-pointer"
                    onClick={() => onLoginClick()}
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

export default LoginCard;
