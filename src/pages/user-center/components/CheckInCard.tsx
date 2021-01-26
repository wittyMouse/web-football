import React from "react";
import { CheckInInfo, CheckInConfig } from "../data";
import Unchecked from "../../../assets/images/icon-09.png";
import Checked from "../../../assets/images/icon-10.png";

interface CheckInCardProps {
  loading: boolean;
  signInConfigList: CheckInConfig[];
  checkInInfo: CheckInInfo;
  onCheckIn: () => void;
}

const CheckInCard: React.FC<CheckInCardProps> = (props) => {
  const { signInConfigList, checkInInfo, onCheckIn } = props;

  return (
    <div className="box-s b-w pading-1 m-b20" style={{ paddingBottom: "8px" }}>
      <div className="clearfix qd-info">
        {checkInInfo.isSignIn ? (
          <span className="f_l">
            你已签到，获取
            {(checkInInfo.dayNum as number) % 7 === 0
              ? signInConfigList[signInConfigList.length - 1].donateIntegral
              : signInConfigList[((checkInInfo.dayNum as number) % 7) - 1]
                  .donateIntegral}
            积分
          </span>
        ) : null}
        <span className="f_r">
          您的积分为：<b>{checkInInfo.integral || 0}</b>
        </span>
      </div>
      <ul className="jb-list">
        {signInConfigList.map((item) => {
          const { id, dayNum, donateIntegral } = item;
          let icon = "";
          if (checkInInfo.dayNum === 0) {
            icon = Unchecked;
          } else {
            const result = (checkInInfo.dayNum as number) % 7;
            if (result === 0 && checkInInfo.isSignIn) {
              icon = Checked;
            } else {
              icon = result >= (dayNum as number) ? Checked : Unchecked;
            }
          }
          return (
            <li key={id}>
              <img src={icon} />
              {donateIntegral}
            </li>
          );
        })}
      </ul>
      {checkInInfo.isSignIn ? (
        <div className="yjd">今日已签到</div>
      ) : (
        <input
          className="check-in-button"
          type="button"
          value="签到"
          onClick={onCheckIn}
        />
      )}
    </div>
  );
};

export default CheckInCard;
