import React from "react";

interface ResultProps {
  title?: string;
  subTitle?: string;
  icon?: "success" | "warning" | "error";
  extra?: any;
}

const iconMap = {
  success: "icon-15",
  warning: "icon-17",
  error: "icon-18",
};

const Result: React.FC<ResultProps> = (props) => {
  const { title = "警告", subTitle = "", icon = "warning", extra } = props;

  return (
    <div className="result">
      <div className="result__icon">
        {icon ? (
          <img
            className="result__icon--image"
            src={require(`../assets/images/${iconMap[icon]}.gif`).default}
            alt=""
          />
        ) : null}
      </div>
      <div className="result__title">{title}</div>
      <div className="result__subtitle">{subTitle}</div>
      <div className="result__extra">{extra}</div>
    </div>
  );
};

export default Result;
