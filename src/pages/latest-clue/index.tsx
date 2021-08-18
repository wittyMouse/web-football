import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import ArticleList from "./components/ArticleList";
import HotList from "./components/HotList";
import UserList from "./components/UserList";
import {
  requestLatestArticleList,
  requestRecommendArticleList,
  requestUserInfoByDepartment,
} from "./service";
import { requestAdConfigInfo } from "../../service";

interface LatestClueProps {}

const LatestClue: React.FC<LatestClueProps> = () => {
  const { token, isLogin } = useSelector((state: RootState) => state.global);
  const [
    latestArticleListLoading,
    setLatestArticleListLoading,
  ] = useState<boolean>(false);
  const [
    recommendArticleListLoading,
    setRecommendArticleListLoading,
  ] = useState<boolean>(false);
  const [latestArticleList, setLatestArticleList] = useState<any>([]);
  const [recommendArticleList, setRecommendArticleList] = useState<any>([]);
  const [userList1, setUserList1] = useState<any>([]);
  const [userList2, setUserList2] = useState<any>([]);
  const [userList3, setUserList3] = useState<any>([]);
  const [headerAdv, setHeaderAdv] = useState<any>([]);
  const [footerAdv, setFooterAdv] = useState<any>([]);

  /**
   * 获取最新发布
   */
  const getLatestArticleList = () => {
    setLatestArticleListLoading(true);
    requestLatestArticleList({ token, columnIds: ["3", "524377944060203023"], pageNo: 1, pageSize: 40 })
      .then((res) => {
        if (res.data.code === 0) {
          setLatestArticleList(res.data.result.records);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setLatestArticleListLoading(false);
      });
  };

  /**
   * 获取热点线报
   */
  const getRecommendArticleList = () => {
    setRecommendArticleListLoading(true);
    requestRecommendArticleList(token)
      .then((res) => {
        if (res.data.code === 0) {
          setRecommendArticleList(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setRecommendArticleListLoading(false);
      });
  };

  /**
   * 王牌情报组
   */
  const getUserList = (departId: string, cb: (result: any) => void) => {
    const params = {
      token,
      departId,
    };
    requestUserInfoByDepartment(params).then((res) => {
      if (res.data.code === 0) {
        cb && cb(res.data.result);
      } else {
        console.error(res.data.message);
      }
    });
  };

  const getAdConfigInfo = (cb: (result: any) => void) => {
    requestAdConfigInfo().then((res) => {
      if (res.data.code === 0) {
        cb && cb(res.data.result);
      } else {
        console.error(res.data.message);
      }
    });
  };

  useEffect(() => {
    getAdConfigInfo((result) => {
      if (result) {
        if (result[6]) {
          setHeaderAdv(result[6]);
        } else if (result[2]) {
          setHeaderAdv(result[2]);
        }
        if (result[7]) {
          setFooterAdv(result[7]);
        } else if (result[3]) {
          setFooterAdv(result[3]);
        }
      }
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      return;
    }
    getLatestArticleList();
    getRecommendArticleList();
    // 王牌情报组
    getUserList("9", (result) => {
      setUserList1(result);
    });
    // 专业专家团队
    // getUserList("7", (result) => {
    //   setUserList2(result);
    // });
    // 常驻嘉宾主持
    // getUserList("8", (result) => {
    //   setUserList3(result);
    // });
  }, []);

  useEffect(() => {
    if (isLogin) {
      getLatestArticleList();
      getRecommendArticleList();
      // 王牌情报组
      getUserList("9", (result) => {
        setUserList1(result);
      });
      // 专业专家团队
      // getUserList("7", (result) => {
      //   setUserList2(result);
      // });
      // 常驻嘉宾主持
      // getUserList("8", (result) => {
      //   setUserList3(result);
      // });
    }
  }, [isLogin]);

  return (
    <div>
      <div className="top-gg box-s">
        <img
          className="cursor-pointer"
          src={headerAdv && headerAdv.length > 0 ? headerAdv[0].imageUrl : ""}
          alt="adv"
          onClick={() => {
            if (headerAdv[0].pageUrl) {
              window.location.href = headerAdv[0].pageUrl;
            }
          }}
        />
      </div>
      <div className="block-c clearfix">
        <ArticleList title="最新线报" articleList={latestArticleList} />

        <HotList title="当日热点" hotList={recommendArticleList} />
      </div>
      <div className="i-xb-title">
        <img src={require("../../assets/images/index-bt02.png").default} />
      </div>
      <div className="block-c">
        <UserList title="王牌贴士" headerClass="h-bg06" userList={userList1} />

        {/* <UserList
          title="专业专家团队"
          headerClass="h-bg07"
          userList={userList2}
        /> */}

        {/* <UserList
          title="常驻嘉宾主持"
          headerClass="h-bg08"
          userList={userList3}
        /> */}
      </div>

      <div className="foot-gg box-s">
        <img
          className="cursor-pointer"
          src={footerAdv && footerAdv.length > 0 ? footerAdv[0].imageUrl : ""}
          alt="adv"
          onClick={() => {
            if (footerAdv[0].pageUrl) {
              window.location.href = footerAdv[0].pageUrl;
            }
          }}
        />
      </div>
    </div>
  );
};

export default LatestClue;
