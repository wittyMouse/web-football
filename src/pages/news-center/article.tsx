import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { RouteChildrenProps } from "react-router-dom";
import RecommendList from "./components/RecommendList";
import RankingList from "./components/RankingList";
import ArticleCard from "./components/ArticleCard";
import {
  requestRecommendArticleList,
  requestUserInfoByDepartment,
  requestArticleInfo,
} from "./service";

interface ArticleProps extends RouteChildrenProps {}

const Article: React.FC<ArticleProps> = (props) => {
  const { match } = props;
  const { token, isLogin } = useSelector((state: RootState) => state.global);
  const [
    recommendArticleListLoading,
    setRecommendArticleListLoading,
  ] = useState<boolean>(false);
  const [recommendArticleList, setRecommendArticleList] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);
  const [articleDetailLoading, setArticleDetailLoading] = useState<boolean>(
    false
  );
  const [articleDetail, setArticleDetail] = useState<any>({});
  const { id } = match?.params as any;

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

  // 文章详情
  const getArticleInfo = () => {
    setArticleDetailLoading(true);
    requestArticleInfo({ token, articleId: id })
      .then((res) => {
        if (res.data.code === 0) {
          setArticleDetail(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setArticleDetailLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isLogin) {
        getArticleInfo();
        getRecommendArticleList();
        // 预言家
        getUserList("2", (result) => {
          setUserList(result);
        });
      }
    } else {
      getArticleInfo();
      getRecommendArticleList();
      // 预言家
      getUserList("2", (result) => {
        setUserList(result);
      });
    }
  }, [isLogin, id]);

  return (
    <div>
      <div className="top-gg box-s">
        <img src={require("../../assets/images/banner03.png").default} />
      </div>
      <div className="block-c clearfix">
        <div className="f_r b-left">
          <ArticleCard articleDetail={articleDetail} />
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

export default Article;
