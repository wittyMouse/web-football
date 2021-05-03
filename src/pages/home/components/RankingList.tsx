import React from "react";
import { Link } from "react-router-dom";

interface RankingListProps {
  wrapperClass: string;
  headerClass: string;
  title: string;
  userList: any[];
  path: string;
  detailPath: string;
}

const RankingList: React.FC<RankingListProps> = (props) => {
  const {
    wrapperClass,
    headerClass,
    title,
    userList,
    path,
    detailPath,
  } = props;

  return (
    <div className={wrapperClass}>
      <h1 className={`title-bg01 ${headerClass}`}>
        {title}
        <div className="tips-text">（每周一更新）</div>
        <span>
          <Link to={path} className="f5">
            更多
          </Link>
        </span>
      </h1>
      {userList
        ?.map((item: any, idx: number) => {
          // const { avatar, description, id, realname, result, resultMap } = item;
          const { avatar, userId, realname, tui, zhong, zou, fu } = item;
          if (idx < 3) {
            return (
              <dl className="i-list" key={idx}>
                <Link to={`${detailPath}/${userId}`}>
                  <dd className="dd01">
                    <img
                      src={
                        require(`../../../assets/images/icon-pm0${idx + 1}.png`)
                          .default
                      }
                      alt=""
                    />
                  </dd>
                  <dd className="dd02">
                    <img src={avatar} alt="" />
                  </dd>
                  <dt>
                    {realname}
                    {/* <p>{`推:${result ? result.length : 0} 中:${
                      resultMap ? resultMap[1] || 0 : 0
                    } 走:${resultMap ? resultMap[0] || 0 : 0} 负:${
                      resultMap ? resultMap[-1] || 0 : 0
                    }`}</p> */}
                    <p>推:{tui} 中:{zhong} 走:{zou} 负: {fu}</p>
                  </dt>
                </Link>
              </dl>
            );
          } else {
            return (
              <dl className="i-list-t" key={idx}>
                <Link to={`${detailPath}/${userId}`}>
                  <dd className="dd01">{idx + 1}</dd>
                  <dt>
                    {realname}
                    {/* <p>{`推:${result ? result.length : 0} 中:${
                      resultMap ? resultMap[1] || 0 : 0
                    } 走:${resultMap ? resultMap[0] || 0 : 0} 负:${
                      resultMap ? resultMap[-1] || 0 : 0
                    }`}</p> */}
                    <p>推:{tui} 中:{zhong} 走:{zou} 负: {fu}</p>
                  </dt>
                </Link>
              </dl>
            );
          }
        })
        .filter((_, index) => index < 10)}
    </div>
  );
};

export default RankingList;
