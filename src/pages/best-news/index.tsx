import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import RecommendList from "./components/RecommendList";
import RankingList from "./components/RankingList";
import {
  requestRecommendArticleList,
  requestUserInfoByDepartment,
  requestBestNews,
  requestRankingList
} from "./service";
import { requestAdConfigInfo } from "../../service";

interface BestNewsProps {}

const BestNews: React.FC<BestNewsProps> = () => {
  const { token, isLogin } = useSelector((state: RootState) => state.global);
  const [
    recommendArticleListLoading,
    setRecommendArticleListLoading,
  ] = useState<boolean>(false);
  const [recommendArticleList, setRecommendArticleList] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>({});
  const [headerAdv, setHeaderAdv] = useState<any>([]);
  const [footerAdv, setFooterAdv] = useState<any>([]);

  /**
   * 获取推荐内容
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

  // 线人精准榜
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

  // 重大利好
  const getBestNews = () => {
    const params = {
      id: 1,
    };
    setLoading(true);
    requestBestNews(params)
      .then((res) => {
        if (res.data.code === 0) {
          setDataSource(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
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

  const getRankingList = (type: number, cb: (result: any) => void) => {
    const data = {
      type,
      pageNo: 1,
      pageSize: 10,
    };
    requestRankingList(data).then((res) => {
      if (res.data.code === 0) {
        cb && cb(res.data.result.records);
      } else {
        console.error(res.data.message);
      }
    });
  };

  useEffect(() => {
    getAdConfigInfo((result) => {
      if (result) {
        if (result[10]) {
          setHeaderAdv(result[10]);
        } else if (result[2]) {
          setHeaderAdv(result[2]);
        }
        if (result[11]) {
          setFooterAdv(result[11]);
        } else if (result[3]) {
          setFooterAdv(result[3]);
        }
      }
    });
  }, []);

  useEffect(() => {
    getBestNews();
    const token = localStorage.getItem("token");
    if (token) {
      return;
    }

    getRecommendArticleList();
    // 预言家
    // getUserList("2", (result) => {
    //   setUserList(result);
    // });

    // 劲爆贴士榜
    getRankingList(1, (result) => {
      // console.log(result);
      setUserList(result);
    });
  }, []);

  useEffect(() => {
    if (isLogin) {
      getRecommendArticleList();
      // 预言家
      // getUserList("2", (result) => {
      //   setUserList(result);
      // });

      // 劲爆贴士榜
      getRankingList(1, (result) => {
        // console.log(result);
        setUserList(result);
      });
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
        <div className="f_r b-left">
          <div className="box-s b-w pading-1 m-b24">
            <h1 className="title-bg02 h-bg04" style={{ paddingLeft: "26px" }}>
              重大利好
            </h1>
            <div
              className="bolg-cont ck-content"
              style={{ paddingTop: 0 }}
              dangerouslySetInnerHTML={{ __html: dataSource.content }}
            ></div>
          </div>
        </div>
        <div className="f_l b-right">
          <RecommendList
            title="推荐内容"
            recommendList={recommendArticleList}
          />

          <RankingList title="劲爆贴士榜" userList={userList} />
        </div>
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

export default BestNews;
