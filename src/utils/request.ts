import axios from "axios";
import store from "../store";
import {
  setTipsBoxVisible,
  setTipsBoxConfig,
  changeLoginStatus,
} from "../store/globalSlice";

const request = axios.create();
const { dispatch } = store;

// Add a request interceptor
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    // config.url = `/df_test${config.url}`;
    config.url = `${process.env.REACT_APP_BASE_URL}${config.url}`;

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
request.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data.code === 5010) {
      const tokenTimeout = window.sessionStorage.getItem("tokenTimeout");
      if (tokenTimeout) {
        return response;
      }
      window.sessionStorage.setItem("tokenTimeout", "1");

      dispatch(
        setTipsBoxConfig({
          type: "error",
          title: "操作失败",
          content: response.data.message,
        })
      );
      dispatch(setTipsBoxVisible(true));
      dispatch(
        changeLoginStatus({
          token: "",
          userInfo: {},
          isLogin: false,
        })
      );

      setTimeout(() => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userInfo");
        window.sessionStorage.clear();
      }, 0);
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default request;
