import React from "react";
import { useHistory, useLocation } from "react-router-dom";

interface TabsProps {}

const Tabs: React.FC<TabsProps> = (props) => {
  const { children } = props;
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <div className="m-box">
      <div className="m-links">
        <ul className="clearfix">
          <li
            className={`cursor-pointer ${
              pathname.indexOf("tab1") > -1 ? "seled" : ""
            }`}
            onClick={() => {
              history.push("/user-center/tab1");
            }}
          >
            <a>充值与消费记录</a>
          </li>
          <li
            className={`cursor-pointer ${
              pathname.indexOf("tab2") > -1 ? "seled" : ""
            }`}
            onClick={() => {
              history.push("/user-center/tab2");
            }}
          >
            <a>至尊推介订购</a>
          </li>
          <li
            className={`cursor-pointer ${
              pathname.indexOf("tab3") > -1 ? "seled" : ""
            }`}
            onClick={() => {
              history.push("/user-center/tab3");
            }}
          >
            <a>最新线报推介</a>
          </li>
          <li
            className={`cursor-pointer ${
              pathname.indexOf("tab4") > -1 ? "seled" : ""
            }`}
            onClick={() => {
              history.push("/user-center/tab4");
            }}
          >
            <a>所有流水账</a>
          </li>
          <li
            className={`cursor-pointer ${
              pathname.indexOf("tab5") > -1 ? "seled" : ""
            }`}
            onClick={() => {
              history.push("/user-center/tab5");
            }}
          >
            <a>会员资料修改</a>
          </li>
        </ul>
      </div>

      <div className="m-cont">{children}</div>
    </div>
  );
};

export default Tabs;
