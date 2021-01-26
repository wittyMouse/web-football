import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BasicFooter: React.FC<{}> = () => {
  const [showBottomPadding, setShowBottomPadding] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/playback") {
      if (!showBottomPadding) {
        setShowBottomPadding(true);
      }
    } else {
      if (showBottomPadding) {
        setShowBottomPadding(false);
      }
    }
  }, [location.pathname]);

  return (
    <div
      className="block b-w"
      style={showBottomPadding ? { paddingBottom: "80px" } : {}}
    >
      <div className="block-c p-r footer">
        <p>
          声明
          <br />
          本网资讯仅供体育爱好者浏览、购买中国足彩和参与合法的娱乐活动参考之用。任何人不得将本网资讯用于非法用途，否则责任自负。本网所登载的广告，均为广告客户的个人意见及表达方式，和本网无任何关系。与本网链接的广告，不得涉及反动、迷信、淫秽、色情、赌博等有害内容，不得违反国家法律规定，如有违者，本网有权随时予以删除，并保留与有关部门合作追究的权利。本网站拒绝为任何具有赌博性质的组织进行广告链接和服务。
        </p>
        <p>
          Copyright © 2020 巅峰足球 df1668.com.All Rights Reserved. 版权所有
          粤ICP备2020091095号
        </p>
        <p>
          <a
            target="cyxyv"
            href="https://v.yunaq.com/certificate?domain=www.df1668.com&from=label&code=90030"
          >
            <img src="https://aqyzmedia.yunaq.com/labels/label_sm_90030.png" />
          </a>
          {/* <img
            src={require("../assets/images/pic-yanzheng.png").default}
            alt=""
          /> */}
        </p>
      </div>
    </div>
  );
};

export default BasicFooter;
