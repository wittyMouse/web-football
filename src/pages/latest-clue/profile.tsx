import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { RouteChildrenProps } from "react-router-dom";
import RecommendList from "./components/RecommendList";
import RankingList from "./components/RankingList";
import UserProfile from "./components/UserProfile";
import PaidArticleList from "./components/PaidArticleList";
import {
  requestRecommendArticleList,
  requestUserInfoByDepartment,
  requestMoreArticleList,
  requestUserInfo,
} from "./service";
import { requestAdConfigInfo } from "../../service";

interface LatestClueProfileProps extends RouteChildrenProps {}

const LatestClueProfile: React.FC<LatestClueProfileProps> = (props) => {
  const { match } = props;
  const { token, isLogin } = useSelector((state: RootState) => state.global);
  const [
    recommendArticleListLoading,
    setRecommendArticleListLoading,
  ] = useState<boolean>(false);
  const [userDetailLoading, setUserDetailLoading] = useState<boolean>(false);
  const [moreArticleListLoading, setMoreArticleListLoading] = useState<boolean>(
    false
  );

  const [recommendArticleList, setRecommendArticleList] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);
  const [userDetail, setUserDetail] = useState<any>({});
  const [moreArticleList, setMoreArticleList] = useState<any>([]);
  const [isMore, setIsMore] = useState<boolean>(false);
  const { id } = match?.params as any;
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

  // 获取发布人信息
  const getUserInfo = () => {
    setUserDetailLoading(true);
    requestUserInfo({ token, userId: id })
      .then((res) => {
        if (res.data.code === 0) {
          setUserDetail(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setUserDetailLoading(false);
      });
  };

  // 底部推荐文章
  const getMoreArticleList = (showMore: number = 0) => {
    let pages = {
      pageNo: 1,
      pageSize: 10,
    };
    if (showMore) {
      pages = {
        pageNo: 1,
        pageSize: 9999,
      };
    }
    setMoreArticleListLoading(true);
    requestMoreArticleList({ token, userId: id, ...pages })
      .then((res) => {
        if (res.data.code === 0) {
          setMoreArticleList(res.data.result.records);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setMoreArticleListLoading(false);
      });
  };

  // 显示更多
  const showMore = () => {
    if (isMore) {
      return;
    }
    setIsMore(true);
    getMoreArticleList(1);
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
      if (isLogin) {
        getUserInfo();
        getMoreArticleList();
        getRecommendArticleList();
        // 预言家
        getUserList("2", (result) => {
          setUserList(result);
        });
      }
    } else {
      getUserInfo();
      getMoreArticleList();
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
          <UserProfile userDetail={userDetail} />

          <PaidArticleList
            realname={userDetail.realname}
            paidArticleList={moreArticleList}
            isMore={isMore}
            showMore={showMore}
          />
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
      <div className="block b-w"></div>
    </div>
  );
};

export default LatestClueProfile;
