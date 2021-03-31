import React, { useState, useEffect } from "react";
import { RouteChildrenProps, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import Tabs from "./components/Tabs";
import RankingList from "./components/RankingList";
import LatestClueList from "./components/LatestClueList";
import Banner from "./components/Banner";
import {
  requestArticleList,
  requestUserInfoByDepartment,
  requestLatestArticleList,
  requestRankingList,
} from "./service";
import { requestAdConfigInfo } from "../../service";

interface HomeProps extends RouteChildrenProps {}

const Home: React.FC<HomeProps> = (props) => {
  const { history } = props;
  const { token, isLogin, userInfo } = useSelector(
    (state: RootState) => state.global
  );

  const [articleListLoading, setArticleListLoading] = useState<boolean>(false);
  const [
    latestArticleListLoading,
    setLatestArticleListLoading,
  ] = useState<boolean>(false);
  const [articleList, setArticleList] = useState<any>([]);
  const [latestArticleList, setLatestArticleList] = useState<any>([]);
  const [userList1, setUserList1] = useState<any>([]);
  const [userList2, setUserList2] = useState<any>([]);
  const [userList3, setUserList3] = useState<any>([]);
  const [orderList, setOrderList] = useState<any>([]);
  const [bannerList, setBannerList] = useState<any>([]);
  const [footerAdv, setFooterAdv] = useState<any>([]);

  // tabs数据
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

  // 最新线报
  const getLatestArticleList = () => {
    setLatestArticleListLoading(true);
    requestLatestArticleList({ token, columnIds: ["524385721436475449"] })
      .then((res) => {
        if (res.data.code === 0) {
          setLatestArticleList(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setLatestArticleListLoading(false);
      });
  };

  // 根据部门id获取用户数据
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
      if (result && result[0]) {
        setBannerList(result[0]);
      }
      if (result) {
        if (result[1]) {
          setFooterAdv(result[1]);
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
        let orderList = window.localStorage.getItem(`${userInfo.id}-orderList`);
        if (orderList) {
          orderList = JSON.parse(orderList);
          setOrderList(orderList);
        }
        getArticleList();
        getLatestArticleList();
        // // 名家指路
        // getUserList("1", (result) => {
        //   setUserList1(result);
        // });
        // // 预言家
        // getUserList("2", (result) => {
        //   setUserList2(result);
        // });
        // 至尊精选推荐
        getUserList("3", (result) => {
          setUserList3(result);
        });

        // 王牌推介榜
        getRankingList(0, (result) => {
          // console.log(result);
          setUserList1(result);
        });
        // 劲爆贴士榜
        getRankingList(1, (result) => {
          // console.log(result);
          setUserList2(result);
        });
      }
    } else {
      // 退出后清空订单列表
      setOrderList((orderList: any[]) => {
        if (orderList.length > 0) {
          return [];
        }
        return orderList;
      });
      getArticleList();
      getLatestArticleList();
      // // 名家指路
      // getUserList("1", (result) => {
      //   setUserList1(result);
      // });
      // // 预言家
      // getUserList("2", (result) => {
      //   setUserList2(result);
      // });

      // 王牌情报组
      getUserList("3", (result) => {
        setUserList3(result);
      });
      // 王牌推介榜
      getRankingList(0, (result) => {
        // console.log(result);
        setUserList1(result);
      });
      // 劲爆贴士榜
      getRankingList(1, (result) => {
        // console.log(result);
        setUserList2(result);
      });
    }
  }, [isLogin]);

  return (
    <div>
      <div className="kf-fd">
        <img src={require("../../assets/images/icon-kf.png").default} alt="" />
        <div className="kf-cont">
          <img src={require("../../assets/images/qrcode.jpg").default} alt="" />
          <p>
            客服热线：<b>400-000-1357</b>工作时间
            <br />
            周一到周日
            <br />
            11:30-21:00
          </p>
          <div className="ke-cart p-r">
            <span>{orderList.length}</span>
            <a>
              <img
                className="cursor-pointer"
                src={require("../../assets/images/icon-13.png").default}
                alt=""
                onClick={() => {
                  history.push("/latest-clue/shop-car");
                }}
              />
            </a>
          </div>
        </div>
      </div>

      <div
        className="block zhuti"
        style={{
          backgroundImage: `url(${
            require("../../assets/images/zt-bg.jpg").default
          })`,
        }}
      >
        <div className="block-c p-r">
          <div className="zt-bat">
            <Link to="/recommend/index" className="ztb01">
              至尊推介
            </Link>
            <Link to="/best-news" className="ztb02">
              重大利好
            </Link>
            <Link to="/latest-clue/index" className="ztb03">
              最新线报
            </Link>
            <Link to="/playback" className="ztb04">
              节目回放
            </Link>
          </div>
        </div>
        <div className="block-c clearfix">
          <div className="f_l">
            <Tabs articleList={articleList} />
          </div>
          <div className="f_r banner box-s">
            <Banner bannerList={bannerList} />
          </div>
        </div>
      </div>

      <div className="block-c">
        <div className="i-xb-title">
          <img
            src={require("../../assets/images/index-bt01.png").default}
            alt=""
          />
        </div>
        <div className="index-xb clearfix">
          {userList3?.map((item: any) => {
            const {
              avatar,
              description,
              id,
              realname,
              result,
              resultMap,
              num,
            } = item;
            return (
              <dl
                className="box-s cursor-pointer"
                key={id}
                onClick={() => {
                  history.push(`/recommend/detail/${id}`);
                }}
              >
                {/* <div className="gxshul">5</div> */}
                {num && num > 0 ? (
                  <div className="new-mark">
                    <img
                      className="new-mark-image"
                      src={require("../../assets/images/icon-new.gif").default}
                      alt="new"
                    />
                  </div>
                ) : null}
                <dd>
                  <a>
                    <img src={avatar} alt="avatar" />
                  </a>
                </dd>
                <dt style={{ overflow: "hidden" }}>
                  <h1>
                    <a>{realname}</a>
                  </h1>
                  <p className="text-multi-ellipsis--l2">{description}</p>
                </dt>
              </dl>
            );
          })}
        </div>

        {userList3 && userList3.length > 0 ? (
          <Link to="/recommend/index" className="i-qb-more box-s">
            查看更多情报
            <img
              src={require("../../assets/images/icon-01.png").default}
              alt=""
            />
          </Link>
        ) : null}
      </div>

      <div className="block-c xbao-cont box-s clearfix">
        <LatestClueList
          title="赛事前瞻"
          latestArticleList={latestArticleList}
        />

        <RankingList
          wrapperClass="f_l mjzl-v"
          headerClass="h-bg02"
          title="王牌推介榜"
          userList={userList1}
          path="/recommend/index"
          detailPath="/recommend/detail"
        />

        <RankingList
          wrapperClass="f_r yy-v"
          headerClass="h-bg03"
          title="劲爆贴士榜"
          userList={userList2}
          path="/latest-clue/index"
          detailPath="/latest-clue/profile"
        />
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

export default Home;
