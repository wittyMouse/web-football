import React, { useState, useEffect } from "react";
import { RouteChildrenProps } from "react-router-dom";
import querystring from "querystring";
import Result from "../../components/Result";
import { TipsQueryString } from "./data.d";
import "./index.css";

interface TipsProps extends RouteChildrenProps {}

const Tips: React.FC<TipsProps> = (props) => {
  const { location, history } = props;

  const [title, setTitle] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [icon, setIcon] = useState<string>("");

  const onButtonClick = (type: string) => {
    if (type === "confirm") {
      // 确定
      history.push("/user-center");
    }
  };

  useEffect(() => {
    const qs = location.search.replace("?", "");
    const { title, subTitle, icon }: TipsQueryString = querystring.parse(qs);
    if (title) {
      setTitle(title);
    }
    if (subTitle) {
      setSubTitle(subTitle);
    }
    if (icon) {
      setIcon(icon);
    }
  }, []);

  return (
    <div className="tips">
      <div className="tips-card">
        <Result
          title={title}
          subTitle={subTitle}
          icon={icon as "success" | "warning" | "error"}
          extra={
            <button
              className="result__button"
              type="button"
              onClick={() => onButtonClick("confirm")}
            >
              确定
            </button>
          }
        ></Result>
      </div>
    </div>
  );
};

export default Tips;
