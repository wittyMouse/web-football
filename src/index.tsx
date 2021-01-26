import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import "./assets/style.css";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
// import { Helmet } from "react-helmet";
import ScrollToTop from "./components/ScrollToTop";
import reportWebVitals from "./reportWebVitals";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

ReactDOM.render(
  <Router>
    <Provider store={store}>
      {/* <Helmet>
        <title>巅峰足球</title>
      </Helmet> */}
      <ScrollToTop />
      <App />
    </Provider>
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
