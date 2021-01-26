import React from "react";
import { Link } from "react-router-dom";

interface RankingListProps {
  title: string;
  userList: any;
}

const RankingList: React.FC<RankingListProps> = (props) => {
  const { title, userList } = props;

  return (
    <div className="box-s b-w pading-1 m-b24">
      <h1 className="title-bg02 h-bg10">{title}</h1>
      <div className="mjzl-v2">
        {userList?.map((item: any, idx: number) => {
          const { avatar, description, id, realname, result, resultMap } = item;
          return (
            <dl className="bp-list" key={id}>
              <Link to="/">
                <dd className="dd01">
                  {idx < 3 ? (
                    <img
                      src={
                        require(`../../../assets/images/icon-pm0${idx + 1}.png`)
                          .default
                      }
                    />
                  ) : (
                    <i>{idx + 1}</i>
                  )}
                </dd>
                <dd className="dd02">
                  <img src={avatar} />
                </dd>
                <dt>
                  {realname}
                  <p>{`推:${result ? result.length : 0} 中:${
                    resultMap ? resultMap[1] || 0 : 0
                  } 走:${resultMap ? resultMap[0] || 0 : 0} 负:${
                    resultMap ? resultMap[-1] || 0 : 0
                  }`}</p>
                </dt>
              </Link>
            </dl>
          );
        })}
      </div>
    </div>
  );
};

export default RankingList;
