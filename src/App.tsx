import React, { useEffect, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/index";
import {
  setLoginBoxVisible,
  setTipsBoxConfig,
  setTipsBoxVisible,
  setWeChartBoxVisible,
  changeLoginStatus,
  setUserInfo,
  setRegisterStatus,
  setRegisterBoxVisible
} from "./store/globalSlice";
import {
  requestUserInfo,
  requestLoginByQRCode,
  requestBindingOpenIdByCode,
  requestRegisterByWechat,
} from "./service";
import Login from "./components/Login";
import Register from "./components/Register";
import WeChartModal from "./components/WeChartModal";
import TipsBox from "./components/TipsBox";
import BasicHeader from "./components/BasicHeader";
import BasicFooter from "./components/BasicFooter";
import Loading from "./components/Loading";
import querystring from "querystring";

const Home = React.lazy(() => import("./pages/home"));
const Playback = React.lazy(() => import("./pages/playback"));
const BestNews = React.lazy(() => import("./pages/best-news"));
const RankingList = React.lazy(() => import("./pages/ranking-list"));
const Recommend = React.lazy(() => import("./pages/recommend"));
const RecommendDetail = React.lazy(() => import("./pages/recommend/detail"));
const LatestClue = React.lazy(() => import("./pages/latest-clue"));
const LatestClueDetail = React.lazy(() => import("./pages/latest-clue/detail"));
const LatestClueProfile = React.lazy(
  () => import("./pages/latest-clue/profile")
);
const News = React.lazy(() => import("./pages/news-center/index"));
const Article = React.lazy(() => import("./pages/news-center/article"));
const UserCenter = React.lazy(() => import("./pages/user-center"));
const ShopCar = React.lazy(() => import("./pages/shop-car"));
const CheckOrder = React.lazy(() => import("./pages/shop-car/check-order"));
const OrderSuccess = React.lazy(() => import("./pages/shop-car/order-success"));

function App() {
  const {
    loginBoxVisible,
    registerBoxVisible,
    tipsBoxVisible,
    weChartBoxVisible,
  } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  const getUserInfo = (token: string, callback: (res: any) => void) => {
    requestUserInfo(token).then((res) => {
      callback && callback(res);
    });
  };

  // const loginByQRCode = (data: { code: string, type: number }) => {
  //   requestLoginByQRCode(data).then((res) => {
  //     if (res.data.code === 0) {
  //       const token = res.data.result;
  //       getUserInfo(token, (res) => {
  //         if (res.data.code === 0) {
  //           const userInfo = res.data.result;
  //           window.localStorage.setItem("token", token);
  //           window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
  //           dispatch(
  //             changeLoginStatus({
  //               token,
  //               userInfo,
  //               isLogin: true,
  //             })
  //           );
  //           dispatch(
  //             setTipsBoxConfig({
  //               type: "success",
  //               title: "操作成功",
  //               content: "登录成功",
  //             })
  //           );
  //           dispatch(setTipsBoxVisible(true));
  //         } else {
  //           dispatch(
  //             setTipsBoxConfig({
  //               type: "error",
  //               title: "操作失败",
  //               content: res.data.message,
  //             })
  //           );
  //           dispatch(setTipsBoxVisible(true));
  //         }
  //       });
  //     } else {
  //       dispatch(
  //         setTipsBoxConfig({
  //           type: "error",
  //           title: "操作失败",
  //           content: res.data.message,
  //         })
  //       );
  //       dispatch(setTipsBoxVisible(true));
  //     }
  //   });
  // };

  const bindingOpenIdByCode = (data: { token: string; code: string }) => {
    const { token } = data;
    requestBindingOpenIdByCode(data).then((res) => {
      dispatch(setWeChartBoxVisible(false));
      if (res.data.code === 0) {
        dispatch(
          setTipsBoxConfig({
            type: "success",
            title: "操作成功",
            content: "绑定成功",
          })
        );
        dispatch(setTipsBoxVisible(true));

        getUserInfo(token, (res) => {
          if (res.data.code === 0) {
            const userInfo = res.data.result;
            window.localStorage.setItem("token", token);
            window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
            dispatch(
              changeLoginStatus({
                token,
                userInfo,
                isLogin: true,
              })
            );
          }
        });
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
    });
  };

  const registerByWechat = (data: { code: string; type: number }) => {
    requestRegisterByWechat(data).then((res) => {
      if (res.data.code === 0) {
        const token = res.data.result;
        getUserInfo(token, (res) => {
          if (res.data.code === 0) {
            const userInfo = res.data.result;
            if (!userInfo.mobile) {
              window.sessionStorage.setItem("register-token", token);
              window.sessionStorage.setItem("register-userInfo", JSON.stringify(userInfo));
              dispatch(setRegisterStatus(2))
              dispatch(setRegisterBoxVisible(true))
            } else {
              window.localStorage.setItem("token", token);
              window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
              dispatch(
                changeLoginStatus({
                  token,
                  userInfo,
                  isLogin: true,
                })
              );
              dispatch(
                setTipsBoxConfig({
                  type: "success",
                  title: "操作成功",
                  content: "登录成功",
                })
              );
              dispatch(setTipsBoxVisible(true));
            }
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
        });
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
    });
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const userInfo = window.localStorage.getItem("userInfo");
    if (token && userInfo) {
      dispatch(
        changeLoginStatus({
          token,
          userInfo: JSON.parse(userInfo),
          isLogin: true,
        })
      );
      requestUserInfo(token).then((res) => {
        if (res.data.code === 0) {
          dispatch(setUserInfo(res.data.result));
        }
      });
    }
  }, []);

  return (
    <div className="app">
      {loginBoxVisible ? <Login /> : null}
      {registerBoxVisible ? <Register /> : null}
      {weChartBoxVisible ? <WeChartModal /> : null}
      {tipsBoxVisible ? <TipsBox /> : null}
      <BasicHeader />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route
            path="/home"
            render={(routeProps) => <Home {...routeProps} />}
          />
          <Route path="/recommend">
            <Switch>
              <Redirect exact from="/recommend" to="/recommend/index" />
              <Route
                path="/recommend/index"
                render={(routeProps) => <Recommend {...routeProps} />}
              />
              <Route
                path="/recommend/detail/:id"
                render={(routeProps) => <RecommendDetail {...routeProps} />}
              />
            </Switch>
          </Route>
          <Route path="/latest-clue">
            <Switch>
              <Redirect exact from="/latest-clue" to="/latest-clue/index" />
              <Route
                path="/latest-clue/index"
                render={(routeProps) => <LatestClue {...routeProps} />}
              />
              <Route
                path="/latest-clue/detail/:id"
                render={(routeProps) => <LatestClueDetail {...routeProps} />}
              />
              <Route
                path="/latest-clue/profile/:id"
                render={(routeProps) => <LatestClueProfile {...routeProps} />}
              />
              <Route
                path="/latest-clue/news-center"
                render={(routeProps) => <News {...routeProps} />}
              />
              <Route
                path="/latest-clue/article/:id"
                render={(routeProps) => <Article {...routeProps} />}
              />
              <Route
                path="/latest-clue/shop-car"
                render={(routeProps) => <ShopCar {...routeProps} />}
              />
              <Route
                path="/latest-clue/check-order"
                render={(routeProps) => <CheckOrder {...routeProps} />}
              />
              <Route
                path="/latest-clue/order-success"
                render={(routeProps) => <OrderSuccess {...routeProps} />}
              />
            </Switch>
          </Route>
          <Route
            path="/playback"
            render={(routeProps) => <Playback {...routeProps} />}
          />
          <Route
            path="/best-news"
            render={(routeProps) => <BestNews {...routeProps} />}
          />
          <Route
            path="/ranking-list"
            render={(routeProps) => <RankingList {...routeProps} />}
          />
          <Route
            path="/user-center"
            render={(routeProps) => <UserCenter {...routeProps} />}
          />
          <Route
            path="/redirect"
            render={({ location }) => {
              dispatch(setLoginBoxVisible(false));
              // console.log(location.search)
              const res = querystring.parse(
                location.search.replace("?", "")
              ) as { code?: string; state: string };

              const { url, target } = querystring.parse(
                (res.state.match(/[\d\w]{2}/g) as string[])
                  .map((item: string) =>
                    String.fromCharCode(parseInt(item, 16))
                  )
                  .join("")
              );

              if (res.code) {
                if (target === "login") {
                  registerByWechat({ code: res.code as string, type: 0 });
                } else if (target === "bind") {
                  const token = window.localStorage.getItem("token");
                  bindingOpenIdByCode({
                    code: res.code as string,
                    token: token as string,
                  });
                }
              } else {
                dispatch(
                  setTipsBoxConfig({
                    type: "error",
                    title: "操作失败",
                    content: "用户禁止授权",
                  })
                );
                dispatch(setTipsBoxVisible(true));
              }
              return (
                <Redirect
                  to={{
                    pathname: url as string,
                  }}
                />
              );
            }}
          />
        </Switch>
      </Suspense>
      <BasicFooter />
    </div>
  );
}

export default App;
