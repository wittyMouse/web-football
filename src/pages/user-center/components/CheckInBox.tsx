import React, { useEffect } from "react";
import { CheckInInfo, CheckInConfig } from "../data";
import Unchecked from "../../../assets/images/icon-11.png";
import Checked from "../../../assets/images/icon-12.png";

interface CheckInBoxProps {
  loading: boolean;
  signInConfigList: CheckInConfig[];
  checkInInfo: CheckInInfo;
  onCheckIn: () => void;
  onClose: () => void;
}

const CheckInBox: React.FC<CheckInBoxProps> = (props) => {
  const { signInConfigList, checkInInfo, onCheckIn, onClose } = props;
  let total = 0;
  signInConfigList.forEach((item) => {
    total += item.donateIntegral as number;
  });

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
      <div
        className="qd-page"
        onClick={(e: any) => {
          e.stopPropagation();
        }}
      >
        {checkInInfo.isSignIn ? (
          <div className="qd-title yqd-ok">
            <p>
              签到成功！已获
              {(checkInInfo.dayNum as number) % 7 === 0
                ? signInConfigList[signInConfigList.length - 1].donateIntegral
                : signInConfigList[((checkInInfo.dayNum as number) % 7) - 1]
                    .donateIntegral}
              积分
            </p>
          </div>
        ) : (
          <div className="qd-title">
            <p>
              请签到！可获
              {
                signInConfigList[(checkInInfo.dayNum as number) % 7]
                  .donateIntegral
              }
              积分
              <span>
                注：签到第7天可获
                {signInConfigList[signInConfigList.length - 1].donateIntegral}
                积分，每周共{total}积分
              </span>
            </p>
          </div>
        )}
        <div>
          <ul className="jb-list2">
            {signInConfigList.map((item) => {
              const { id, dayNum } = item;
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
                  {dayNum}天
                </li>
              );
            })}
          </ul>
          <div style={{ paddingTop: "10px" }}>
            {checkInInfo.isSignIn ? (
              <input
                className="c-bat02"
                type="button"
                name="button"
                value="继续浏览"
                onClick={onClose}
              />
            ) : (
              <input
                className="c-bat01"
                type="button"
                name="button"
                value="签 到"
                onClick={onCheckIn}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mark-bg" onClick={onClose}></div>
    </div>
  );
};

export default CheckInBox;
