import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/index";
import { setUserInfo } from "../../store/globalSlice";
import { RouteChildrenProps } from "react-router-dom";
import RecommendList from "./components/RecommendList";
import RankingList from "./components/RankingList";
import PaidArticleList from "./components/PaidArticleList";
import LoginCard from "./components/LoginCard";
import PayCard from "./components/PayCard";
import RechargeCard from "./components/RechargeCard";
import RechargeBox from "./components/RechargeBox";
import {
  requestRecommendArticleList,
  requestUserInfoByDepartment,
  requestMoreArticleList,
  requestArticleInfo,
  requestBuyArticle,
} from "./service";
import { requestUserInfo, requestAdConfigInfo } from "../../service";

interface LatestClueDetailProps extends RouteChildrenProps {}

const LatestClueDetail: React.FC<LatestClueDetailProps> = (props) => {
  const { match } = props;
  const { token, isLogin, userInfo } = useSelector(
    (state: RootState) => state.global
  );
  const dispatch = useDispatch();
  const [
    recommendArticleListLoading,
    setRecommendArticleListLoading,
  ] = useState<boolean>(false);
  const [articleDetailLoading, setArticleDetailLoading] = useState<boolean>(
    false
  );
  const [moreArticleListLoading, setMoreArticleListLoading] = useState<boolean>(
    false
  );
  const [buyArticleLoading, setbuyArticleLoading] = useState<boolean>(false);

  const [recommendArticleList, setRecommendArticleList] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);
  const [articleDetail, setArticleDetail] = useState<any>({});
  const [moreArticleList, setMoreArticleList] = useState<any>([]);
  const [isMore, setIsMore] = useState<boolean>(false);
  const [rechargeBoxVisible, setRechargeBoxVisible] = useState<boolean>(false);
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

  // 文章详情
  const getArticleInfo = (params: any, cb?: any) => {
    setArticleDetailLoading(true);
    requestArticleInfo(params)
      .then((res) => {
        if (res.data.code === 0) {
          setArticleDetail(res.data.result);
          cb && cb(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setArticleDetailLoading(false);
      });
  };

  // 底部推荐文章
  const getMoreArticleList = (params: any, showMore: number = 0) => {
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
    requestMoreArticleList({ ...params, ...pages })
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

  // 获取会员信息
  const getMemberInfo = () => {
    requestUserInfo(token).then((res) => {
      if (res.data.code === 0) {
        const userInfo = res.data.result;
        dispatch(setUserInfo(userInfo));
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
    });
  };

  // 购买文章请求
  const buyArticle = (articleId: string) => {
    setbuyArticleLoading(true);
    requestBuyArticle({ token, articleId })
      .then((res) => {
        if (res.data.code === 0) {
          getArticleInfo({ token, articleId: id });
          getMemberInfo()
        } else {
        }
      })
      .finally(() => {
        setbuyArticleLoading(false);
      });
  };

  // 点击购买按钮
  const onPayClick = (articleId: string) => {
    buyArticle(articleId);
  };

  // 点击充值按钮
  const onRechargeClick = () => {
    setRechargeBoxVisible(true);
  };

  // 显示更多
  const showMore = () => {
    if (isMore) {
      return;
    }
    setIsMore(true);
    getMoreArticleList({ token, userId: articleDetail.userId }, 1);
  };

  const getRenderContent = () => {
    if (!isLogin) {
      // 未登录
      return <LoginCard articleDetail={articleDetail} />;
    } else {
      if (articleDetail.isBuy) {
        // 已购买
        return (
          <div
            className="b-cont ck-content"
            style={{ lineHeight: 'unset' }}
            dangerouslySetInnerHTML={{ __html: articleDetail.articleURL }}
          />
        );
      } else {
        if (articleDetail.amount - (userInfo.balance as number) > 0) {
          // 余额不足
          return (
            <RechargeCard
              articleDetail={articleDetail}
              userInfo={userInfo}
              onRechargeClick={onRechargeClick}
            />
          );
        } else {
          // 未购买文章
          return (
            <PayCard articleDetail={articleDetail} onPayClick={onPayClick} />
          );
        }
      }
    }
  };

  // 关闭充值弹窗
  const onRechargeBoxClose = () => {
    setRechargeBoxVisible(false);
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
        getMemberInfo();
        getArticleInfo({ token, articleId: id }, (res: any) => {
          getMoreArticleList({ token, userId: res.userId });
        });
        getRecommendArticleList();
        // 预言家
        getUserList("2", (result) => {
          setUserList(result);
        });
      }
    } else {
      getArticleInfo({ token, articleId: id }, (res: any) => {
        getMoreArticleList({ token, userId: res.userId });
      });
      getRecommendArticleList();
      // 预言家
      getUserList("2", (result) => {
        setUserList(result);
      });
    }
  }, [isLogin, id]);

  return (
    <div>
      {rechargeBoxVisible ? <RechargeBox onClose={onRechargeBoxClose} /> : null}

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
              详细内容
            </h1>
            <div className="bolg-cont">
              <h1>
                {articleDetail.articleTitle}
                <p>
                  时间：{articleDetail.publicationTime}　作者：
                  {articleDetail.realname}　点击：{articleDetail.clickNum} 次
                </p>
              </h1>

              {getRenderContent()}
            </div>
          </div>

          <PaidArticleList
            realname={articleDetail.realname}
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

export default LatestClueDetail;
