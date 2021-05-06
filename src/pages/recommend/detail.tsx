import React, { useState, useEffect } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setTipsBoxVisible,
  setTipsBoxConfig,
  setUserInfo,
} from "../../store/globalSlice";
import { RootState } from "../../store/index";
import Pagination from "../../components/Pagination";
import {
  requestUserInfo,
  requestSubscribe,
  requestRecommendList,
  requestMemberInfo,
} from "./service";
import { requestAdConfigInfo } from "../../service";
import isEmpty from "lodash/isEmpty";
import jQuery from "jquery";
import jqueryPieLoader from "../../utils/jquery-pie-loader";
import "../../assets/css/jquery-pie-loader.css";
jqueryPieLoader(jQuery);

interface RecommendDetailProps extends RouteChildrenProps {}

const resultDic: any = {
  "-2": "负",
  "-1": "负",
  0: "走",
  1: "胜",
  2: "胜",
};

const resultClassMap: any = {
  "-2": 3,
  "-1": 3,
  0: 2,
  1: 1,
  2: 1,
};

// -2：输，-1：输半，0：走，1：赢半，2：赢
const resultImageMap: any = {
  "-2": "zj4",
  "-1": "zj6",
  0: "zj3",
  1: "zj5",
  2: "zj1",
};

const RecommendDetail: React.FC<RecommendDetailProps> = (props) => {
  const { match } = props;
  const { token, isLogin, userInfo } = useSelector(
    (state: RootState) => state.global
  );
  const dispatch = useDispatch();
  const [subscribeLoading, setSubscribeLoading] = useState<boolean>(false);

  const [userDetailLoading, setUserDetailLoading] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<any>({});

  const [dataSourceLoading, setDataSourceLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState([]);
  const [pages, setPages] = useState({
    pageNo: 1,
    pageSize: 16,
    total: 0,
  });
  const [current, setCurrent] = useState<number>(0);
  const [priceList, setPriceList] = useState<number[]>([]);
  const { id } = match?.params as any;
  const [headerAdv, setHeaderAdv] = useState<any>([]);
  const [footerAdv, setFooterAdv] = useState<any>([]);

  // 获取发布人信息
  const getUserInfo = (cb?: (userDetail: any) => void) => {
    setUserDetailLoading(true);
    requestUserInfo({ token, userId: id })
      .then((res) => {
        if (res.data.code === 0) {
          const _userDetail = res.data.result;
          const { dayAmount, weekAmount, monthAmount } = _userDetail;
          const _priceList = [dayAmount, weekAmount, monthAmount];
          setUserDetail(_userDetail);
          setPriceList(_priceList);
          cb && cb(_userDetail);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setUserDetailLoading(false);
      });
  };

  // 获取至尊推介内容
  const getRecommendList = (
    _pages: any = { pageNo: pages.pageNo, pageSize: pages.pageSize }
  ) => {
    setDataSourceLoading(true);
    requestRecommendList({
      ..._pages,
      userId: id,
      token,
    })
      .then((res) => {
        if (res.data.code === 0) {
          const { total, records } = res.data.result;
          setDataSource(records);
          setPages((pages) => ({
            ...pages,
            // total: 16 * 10,
            total,
          }));
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setDataSourceLoading(false);
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

  // 至尊推介订购
  const subscribe = (cb?: any) => {
    setSubscribeLoading(true);
    requestSubscribe({ token, userId: id, type: current })
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
        setSubscribeLoading(false);
      });
  };

  // 订阅
  const onSubscribeClick = () => {
    if (!isLogin) {
      dispatch(
        setTipsBoxConfig({
          type: "error",
          title: "操作失败",
          content: "请先登录",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    }

    if (userDetailLoading) {
      return;
    }

    getUserInfo((_userDetail) => {
      const { isSubscribe } = _userDetail;
      if (isSubscribe) {
        dispatch(
          setTipsBoxConfig({
            type: "error",
            title: "操作失败",
            content: "至尊推介订阅还在有效期内",
          })
        );
        dispatch(setTipsBoxVisible(true));
      } else {
        subscribe(() => {
          getMemberInfo();
          getRecommendList();
        });
      }
    });
  };

  // 加入购物车
  const onAddCar = (orderDetail: any) => {
    const newOrder = {
      id: orderDetail.id,
      avatar: orderDetail.avatar,
      realname: orderDetail.realname,
      type: orderDetail.type,
      dayAmount: orderDetail.dayAmount,
      weekAmount: orderDetail.weekAmount,
      monthAmount: orderDetail.monthAmount,
    };

    if (!isLogin) {
      dispatch(
        setTipsBoxConfig({
          type: "error",
          title: "操作失败",
          content: "请先登录",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    }

    if (userDetailLoading) {
      return;
    }

    getUserInfo((_userDetail) => {
      const { isSubscribe } = _userDetail;
      if (isSubscribe) {
        dispatch(
          setTipsBoxConfig({
            type: "error",
            title: "操作失败",
            content: "至尊推介订阅还在有效期内",
          })
        );
        dispatch(setTipsBoxVisible(true));
      } else {
        let orderList: any = window.localStorage.getItem(
          `${userInfo.id}-orderList`
        );
        if (orderList) {
          orderList = JSON.parse(orderList);
          let order: any = {};
          let idx = -1;
          for (let i = 0; i < orderList.length; i++) {
            if (orderList[i].id === newOrder.id) {
              order = orderList[i];
              idx = i;
              break;
            }
          }
          if (idx > -1) {
            if (order.type === newOrder.type) {
              dispatch(
                setTipsBoxConfig({
                  type: "error",
                  title: "操作失败",
                  content: "该订单已在购物车",
                })
              );
              dispatch(setTipsBoxVisible(true));
              return;
            } else {
              orderList[idx] = newOrder;
            }
          } else {
            orderList.push(newOrder);
          }
        } else {
          orderList = [newOrder];
        }
        window.localStorage.setItem(
          `${userInfo.id}-orderList`,
          JSON.stringify(orderList)
        );
        dispatch(
          setTipsBoxConfig({
            type: "success",
            title: "操作成功",
            content: "已添加到购物车",
          })
        );
        dispatch(setTipsBoxVisible(true));
      }
    });
  };

  /**
   * 修改当前页
   * @param current
   */
  const onPageChange = (current: number) => {
    setPages((pages) => {
      if (pages.pageNo !== current) {
        const _pages = {
          ...pages,
          pageNo: current,
        };
        getRecommendList({ pageNo: _pages.pageNo, pageSize: _pages.pageSize });
        return _pages;
      } else {
        return pages;
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
        if (result[4]) {
          setHeaderAdv(result[4]);
        } else if (result[2]) {
          setHeaderAdv(result[2]);
        }
        if (result[5]) {
          setFooterAdv(result[5]);
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
        getRecommendList();
      }
    } else {
      getUserInfo();
      getRecommendList();
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

      <div className="block-c b-w box-s">
        <div className="clearfix tj-about">
          <div className="f_l tj-a-left">
            <h1 className="title-bg02 h-bg11">至尊精选推荐</h1>
            {!isEmpty(userDetail) ? (
              <div className="clearfix tj-x">
                <div className="f_l img-data">
                  <div className="xb-img">
                    <img src={userDetail.avatar} />
                  </div>
                  <figure
                    className="pie"
                    ref={(el: any) => {
                      (jQuery(el) as any).svgPie({
                        percentage: userDetail.winning || 0,
                      });
                    }}
                  ></figure>
                </div>
                <div className="f_r xr-d">
                  <h1>
                    {userDetail.realname}
                    <span>
                      最近五场成绩：
                      {userDetail?.result?.map((item: number, idx: number) => {
                        return (
                          <i
                            className={`bg-i0${resultClassMap[item]}`}
                            key={idx}
                          >
                            {resultDic[item]}
                          </i>
                        );
                      })}
                      &nbsp;&nbsp;&nbsp;&nbsp;胜率：
                      <b>{userDetail.winning || 0}</b>%
                    </span>
                  </h1>
                  <div>
                    {userDetail.description}
                    <p>
                      {/* 【{userDetail.dayAmount}币/日，{userDetail.weekAmount}
                    币/周，{userDetail.monthAmount}币/月】 */}
                      【{userDetail.dayAmount}币/日，{userDetail.weekAmount}
                      币/周期】
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="f_r tj-a-right">
            <div className="tc-info">
              <strong>{userDetail.realname}</strong>
              <br />
              所需价格：
              <b>
                {priceList.length > 0
                  ? current === 3
                    ? priceList[0] * 10
                    : priceList[current]
                  : 0}
              </b>
              &nbsp;{current === 3 ? "积分" : "金币"}
              <p>
                <label
                  className={current === 1 ? "sel" : ""}
                  onClick={() => {
                    setCurrent(1);
                  }}
                >
                  包周
                </label>
                <label
                  className={current === 0 ? "sel" : ""}
                  onClick={() => {
                    setCurrent(0);
                  }}
                >
                  单日
                </label>
                <label
                  className={current === 3 ? "sel" : ""}
                  onClick={() => {
                    setCurrent(3);
                  }}
                >
                  单日积分
                </label>
              </p>
              <input
                type="button"
                className="bat-cat01"
                title="立即订购"
                onClick={onSubscribeClick}
              />
              <input
                type="button"
                className="bat-cat02"
                title="加入购物车"
                onClick={() => {
                  onAddCar({
                    ...userDetail,
                    type: current,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="i-xb-title">
        <img src={require("../../assets/images/index-bt03.png").default} />
      </div>
      <div className="block-c b-w box-s">
        <div className="zj-cont">
          <table
            className="basic-table"
            style={{ width: "1184px", borderSpacing: 1 }}
          >
            <tbody>
              <tr>
                <th
                  style={{
                    width: "150px",
                    height: "40px",
                    textAlign: "center",
                  }}
                >
                  比赛时间
                </th>
                <th style={{ width: "220px", textAlign: "center" }}>赛事</th>
                <th style={{ width: "220px", textAlign: "center" }}>主队</th>
                <th style={{ width: "30px", textAlign: "center" }}>VS</th>
                <th style={{ width: "220px", textAlign: "center" }}>客队</th>
                <th style={{ width: "220px", textAlign: "center" }}>推荐</th>
                <th style={{ width: "60px", textAlign: "center" }}>比分</th>
                <th style={{ width: "50px", textAlign: "center" }}>成绩</th>
              </tr>
              {dataSource?.map((item) => {
                const {
                  competition,
                  disclosureTime,
                  homeTeam,
                  id,
                  proposal,
                  publicationTime,
                  realname,
                  result,
                  score,
                  userId,
                  visitingTeam,
                } = item;

                const formatTime = publicationTime
                  ? (publicationTime as string).slice(
                      0,
                      (publicationTime as string).lastIndexOf(":")
                    )
                  : "";
                return (
                  <tr key={id}>
                    <td
                      style={{
                        height: "46px",
                        textAlign: "center",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {formatTime}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      {competition}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      {homeTeam}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      VS
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      {visitingTeam}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        color: "#c7000b",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      {proposal}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      {score || "待"}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      {typeof result === "number" ? (
                        // <i
                        //   className={`bg-i0${
                        //     result === 0 ? 2 : result > 0 ? 1 : 3
                        //   }`}
                        // >
                        //   {result === 0 ? "走" : result > 0 ? "胜" : "负"}
                        // </i>
                        <img
                          style={{ margin: "0 auto" }}
                          src={
                            require(`../../assets/images/${resultImageMap[result]}.gif`)
                              .default
                          }
                        />
                      ) : (
                        "待"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="pages">
          <Pagination
            current={pages.pageNo}
            pageSize={pages.pageSize}
            total={pages.total}
            onPageChange={onPageChange}
          />
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

export default RecommendDetail;
