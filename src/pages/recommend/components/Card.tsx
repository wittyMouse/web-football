import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  userList: any[];
}

const resultDic: any = {
  "-1": "负",
  0: "走",
  1: "胜",
};

const resultClassMap: any = {
  "-1": 3,
  0: 2,
  1: 1,
};

const Card: React.FC<CardProps> = (props) => {
  const { title, userList } = props;

  return (
    <div className="box-s b-w pading-1 m-b24">
      <h1 className="title-bg02 h-bg11">{title}</h1>
      <div className="clearfix tj-list">
        {userList?.map((item: any) => {
          const { avatar, description, id, realname, result, resultMap, sale } = item;
          return (
            <dl key={id}>
              {sale ? <div className="sale-time"></div> : null}
              <dd className="box-s" key={id}>
                <Link to={`/recommend/detail/${id}`}>
                  <img src={avatar} />
                </Link>
              </dd>
              <dt>
                <h1>
                  <Link to={`/recommend/detail/${id}`}>{realname}</Link>
                </h1>
                {result && result.length > 0 ? (
                  <>
                    近五场成绩&nbsp;
                    <img
                      src={
                        require("../../../assets/images/icon-jt03.png").default
                      }
                    />
                    {result && result.length > 0 ? (
                      <p>
                        {result?.map((item: number, idx: number) => {
                          return (
                            <i
                              className={`bg-i0${resultClassMap[item]}`}
                              key={idx}
                            >
                              {resultDic[item]}
                            </i>
                          );
                        })}
                      </p>
                    ) : null}
                  </>
                ) : null}
              </dt>
            </dl>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
