import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import RecommendList from "./components/RecommendList";
import RankingList from "./components/RankingList";
import NewsList from "./components/NewsList";
import {
  requestArticleList,
  requestRecommendArticleList,
  requestUserInfoByDepartment,
} from "./service";

interface NewsProps {}

const News: React.FC<NewsProps> = () => {
  const { token, isLogin } = useSelector((state: RootState) => state.global);
  const [
    recommendArticleListLoading,
    setRecommendArticleListLoading,
  ] = useState<boolean>(false);
  const [articleListLoading, setArticleListLoading] = useState<any>([]);

  const [recommendArticleList, setRecommendArticleList] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);
  const [articleList, setArticleList] = useState<any>([]);

  // 文章资讯数据
  const getArticleList = () => {
    setArticleListLoading(true);
    requestArticleList(token)
      .then((res) => {
        if (res.data.code === 0) {
          setArticleList(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setArticleListLoading(false);
      });
  };

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      return;
    }
    getArticleList();
    getRecommendArticleList();
    // 预言家
    getUserList("2", (result) => {
      setUserList(result);
    });
  }, []);

  useEffect(() => {
    if (isLogin) {
      getArticleList();
      getRecommendArticleList();
      // 预言家
      getUserList("2", (result) => {
        setUserList(result);
      });
    }
  }, [isLogin]);

  return (
    <div>
      <div className="top-gg box-s">
        <img src={require("../../assets/images/banner03.png").default} />
      </div>
      <div className="block-c clearfix">
        <div className="f_r b-left">
          <NewsList articleList={articleList} />
        </div>
        <div className="f_l b-right">
          <RecommendList
            title="推荐内容"
            recommendList={recommendArticleList}
          />

          <RankingList title="线人精准榜" userList={userList} />
        </div>
      </div>
      <div className="foot-gg box-s">
        <img src={require("../../assets/images/banner02.png").default} />
      </div>
    </div>
  );
};

export default News;
