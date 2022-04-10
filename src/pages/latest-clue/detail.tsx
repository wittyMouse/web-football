import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/index";
import {
  setTipsBoxVisible,
  setTipsBoxConfig,
  setLoginBoxVisible,
  setUserInfo,
} from "../../store/globalSlice";
import { RouteChildrenProps } from "react-router-dom";
import RecommendList from "./components/RecommendList";
import RankingList from "./components/RankingList";
import PaidArticleList from "./components/PaidArticleList";
import LoginCard from "./components/LoginCard";
import PayCard from "./components/PayCard";
import RechargeCard from "./components/RechargeCard";
import RechargeBox from "./components/RechargeBox";
import ConfirmBox from "./components/ConfirmBox";
import ConfirmBox2 from "./components/ConfirmBox2";
import {
  requestRecommendArticleList,
  requestMoreArticleList,
  requestArticleInfo,
  requestBuyArticle,
  requestRankingList,
  requestBuyArticleMarketing,
} from "./service";
import {
  requestUserInfo as requestMemberInfo,
  requestAdConfigInfo,
} from "../../service";

interface LatestClueDetailProps extends RouteChildrenProps {}

const LatestClueDetail: React.FC<LatestClueDetailProps> = (props) => {
  const { history, match } = props;
  const { token, isLogin, userInfo } = useSelector(
    (state: RootState) => state.global
  );
  const dispatch = useDispatch();
  const [recommendArticleListLoading, setRecommendArticleListLoading] =
    useState<boolean>(false);
  const [articleDetailLoading, setArticleDetailLoading] =
    useState<boolean>(false);
  const [moreArticleListLoading, setMoreArticleListLoading] =
    useState<boolean>(false);
  const [buyArticleLoading, setBuyArticleLoading] = useState<boolean>(false);

  const [recommendArticleList, setRecommendArticleList] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);
  const [articleDetail, setArticleDetail] = useState<any>({});
  const [moreArticleList, setMoreArticleList] = useState<any>([]);
  const [isMore, setIsMore] = useState<boolean>(false);
  const [rechargeBoxVisible, setRechargeBoxVisible] = useState<boolean>(false);
  const { id } = match?.params as any;
  const [headerAdv, setHeaderAdv] = useState<any>([]);
  const [footerAdv, setFooterAdv] = useState<any>([]);
  const [confirmBoxVisible, setConfirmBoxVisible] = useState<boolean>(false);
  const [confirmBox2Visible, setConfirmBox2Visible] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<any>({});
  const [subscribeLoading, setSubscribeLoading] = useState<boolean>(false);
  const articleMarketingMap = useRef<any>({});

  /**
   * 确定购买按钮
   * @param e
   */
  const onConfirmBuy = (e: any) => {
    const key = e.target.getAttribute("data-id");
    setUserDetail(articleMarketingMap.current[key]);
    setConfirmBoxVisible(true);
  };

  /**
   * 添加所有文章按钮的事件监听
   */
  const addButtonEventListener = (articleMarketingList: any) => {
    const ckEl = window.document.querySelector(".ck-content");
    if (!ckEl) {
      return;
    }
    const btnEls = ckEl.querySelectorAll(
      ".recommend-button, .recommend-result"
    );
    
    for (let i = 0; i < btnEls.length; i++) {
      const btnEl = btnEls[i];
      if (btnEl.tagName === "SPAN") {
        continue;
      }

      if (articleMarketingList[i].buy) {
        // 已购买
        const parentEl = btnEl.parentNode;
        const spanEl = document.createElement("span");
        spanEl.classList.add("recommend-result");
        spanEl.appendChild(
          document.createTextNode(articleMarketingList[i].proposal)
        );
        if (parentEl) {
          parentEl.replaceChild(spanEl, btnEl);
        }
      } else {
        // 未购买
        const value = btnEl.getAttribute("data-id");
        if (value) {
          continue;
        }
        btnEl.setAttribute("data-id", articleMarketingList[i].id);
        btnEl.addEventListener("click", onConfirmBuy);
      }
    }
  };

  /**
   * 移除所有文章按钮的事件监听
   */
  const clearButtonEventListener = () => {
    const btnEls = window.document.querySelectorAll(
      ".ck-content .recommend-button"
    );
    btnEls.forEach((btnEl: any) => {
      btnEl.removeEventListener("click", onConfirmBuy);
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

  // 文章详情
  const getArticleInfo = (cb?: any) => {
    setArticleDetailLoading(true);
    requestArticleInfo({ token, articleId: id })
      .then((res) => {
        if (res.data.code === 0) {
          const articleDetail = res.data.result;
          setArticleDetail(articleDetail);

          if (
            articleDetail.isBuy &&
            articleDetail.articleMarketingList &&
            articleDetail.articleMarketingList.length > 0
          ) {
            addButtonEventListener(articleDetail.articleMarketingList);
          }

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
    requestMemberInfo(token).then((res) => {
      if (res.data.code === 0) {
        const userInfo = res.data.result;
        dispatch(setUserInfo(userInfo));
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
    });
  };

  // 购买文章请求
  const buyArticle = (cb?: () => void) => {
    setBuyArticleLoading(true);
    requestBuyArticle({ token, articleId: id })
      .then((res) => {
        if (res.data.code === 0) {
          cb && cb();
          dispatch(
            setTipsBoxConfig({
              type: "success",
              title: "操作成功",
              content: res.data.message,
            })
          );
          dispatch(setTipsBoxVisible(true));
        } else {
          dispatch(
            setTipsBoxConfig({
              type: "error",
              title: "操作失败",
              content: res.data.message,
            })
          );
          dispatch(setTipsBoxVisible(true));
        }
      })
      .finally(() => {
        setBuyArticleLoading(false);
      });
  };

  // 点击登录按钮
  const onLoginClick = () => {
    dispatch(setLoginBoxVisible(true));
  };

  // 点击购买按钮
  const onPayClick = () => {
    setConfirmBox2Visible(true);
  };

  // 点击充值按钮
  const onRechargeClick = () => {
    // setRechargeBoxVisible(true);
    history.push("/user-center");
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
      return (
        <LoginCard articleDetail={articleDetail} onLoginClick={onLoginClick} />
      );
    } else {
      if (articleDetail.isBuy) {
        // 已购买
        return (
          <div
            className="b-cont ck-content"
            style={{ lineHeight: "unset" }}
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

  /**
   * 订阅推介
   */
  const onConfirmBoxSubmit = (values: any) => {
    if (subscribeLoading) {
      return;
    }

    const { id: articleMarketingId } = values;
    setSubscribeLoading(true);
    requestBuyArticleMarketing({ token, articleMarketingId })
      .then((res) => {
        if (res.data.code === 0) {
          const btnEl = window.document.querySelector(
            `[data-id="${articleMarketingId}"]`
          );
          if (btnEl) {
            btnEl.removeEventListener("click", onConfirmBuy);
          }
          dispatch(
            setTipsBoxConfig({
              type: "success",
              title: "操作成功",
              content: res.data.message,
            })
          );
          dispatch(setTipsBoxVisible(true));
          onConfirmBoxClose();
          getMemberInfo();
          getArticleInfo();
        } else {
          dispatch(
            setTipsBoxConfig({
              type: "error",
              title: "操作失败",
              content: res.data.message,
            })
          );
          dispatch(setTipsBoxVisible(true));
        }
      })
      .finally(() => {
        setSubscribeLoading(false);
      });
  };

  /**
   * 关闭确认框
   */
  const onConfirmBoxClose = () => {
    setConfirmBoxVisible(false);
    setTimeout(() => {
      setUserDetail({});
    }, 100);
  };

  /**
   * 购买文章
   */
  const onConfirmBox2Submit = () => {
    if (buyArticleLoading) {
      return;
    }

    buyArticle(() => {
      onConfirmBox2Close();
      getMemberInfo();
      getArticleInfo();
    });
  };

  /**
   * 关闭确认框
   */
  const onConfirmBox2Close = () => {
    setConfirmBox2Visible(false);
  };

  useEffect(() => {
    if (
      articleDetail.articleMarketingList &&
      articleDetail.articleMarketingList.length > 0
    ) {
      const obj: any = {};
      articleDetail.articleMarketingList.forEach((item: any) => {
        obj[item.id] = item;
      });
      articleMarketingMap.current = obj;
    }

    return () => {
      articleMarketingMap.current = {};
    };
  }, [articleDetail.articleMarketingList]);

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

    return () => {
      clearButtonEventListener();
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isLogin) {
        getMemberInfo();
        getArticleInfo((res: any) => {
          getMoreArticleList({ token, userId: res.userId });
        });
        getRecommendArticleList();
        // 预言家
        // getUserList("2", (result) => {
        //   setUserList(result);
        // });
        // 劲爆贴士榜
        getRankingList(1, (result) => {
          setUserList(result);
        });
      }
    } else {
      getArticleInfo((res: any) => {
        getMoreArticleList({ token, userId: res.userId });
      });
      getRecommendArticleList();
      // 预言家
      // getUserList("2", (result) => {
      //   setUserList(result);
      // });
      // 劲爆贴士榜
      getRankingList(1, (result) => {
        setUserList(result);
      });
    }
  }, [isLogin, id]);

  return (
    <div>
      {rechargeBoxVisible ? <RechargeBox onClose={onRechargeBoxClose} /> : null}
      {confirmBoxVisible ? (
        <ConfirmBox
          userInfo={userInfo}
          userDetail={userDetail}
          onConfirm={onConfirmBoxSubmit}
          onClose={onConfirmBoxClose}
        />
      ) : null}
      {confirmBox2Visible ? (
        <ConfirmBox2
          userInfo={userInfo}
          userDetail={articleDetail}
          onConfirm={onConfirmBox2Submit}
          onClose={onConfirmBox2Close}
        />
      ) : null}

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
      <div className="block b-w"></div>
    </div>
  );
};

export default LatestClueDetail;
