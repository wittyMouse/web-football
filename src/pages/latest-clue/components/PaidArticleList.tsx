import React from "react";
import { Link } from "react-router-dom";

interface PaidArticleListProps {
  realname: string;
  paidArticleList: any;
  isMore: boolean;
  showMore: () => void;
}

const PaidArticleList: React.FC<PaidArticleListProps> = (props) => {
  const { realname, paidArticleList, isMore, showMore } = props;
  return (
    <div className="box-s b-w pading-1">
      <h1 className="title-bg02 h-bg09" style={{ paddingLeft: "26px" }}>
        推荐内容
      </h1>
      <div className="b-l-cont">
        {paidArticleList?.map((item: any) => {
          const {
            amount,
            articleId,
            articleTitle,
            isNew,
            publicationTime,
            realName,
            userId,
            clickNum,
          } = item;
          return (
            <dl key={articleId}>
              <dt>
                [<Link to={`/latest-clue/profile/${userId}`}>{realName}</Link>]{" "}
                <Link to={`/latest-clue/detail/${articleId}`}>
                  {articleTitle}
                </Link>
                {isNew ? <span className="new">NEW</span> : null}
              </dt>
              <dd className="b-date">{publicationTime}</dd>
              <dd className="b-dj">点击：{clickNum}</dd>
              <dd className="b-bs">{amount}币</dd>
            </dl>
          );
        })}

        {!isMore ? (
          <div className="bo-more cursor-pointer">
            <a onClick={showMore}>《{realname}》更多线报</a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PaidArticleList;
