import React from "react";
import { Link } from "react-router-dom";

interface RecommendListProps {
  title: string;
  recommendList: any;
}

const RecommendList: React.FC<RecommendListProps> = (props) => {
  const { title, recommendList } = props;
  return (
    <div className="box-s b-w pading-1 m-b24">
      <h1 className="title-bg02 h-bg05">{title}</h1>
      <div className="hotxb">
        <ul>
          {recommendList?.map((item: any) => {
            const {
              amount,
              articleId,
              articleTitle,
              isNew,
              publicationTime,
              realName,
              userId,
            } = item;

            return (
              <li className="text-ellipsis" key={articleId}>
                <span>
                  <Link to={`/latest-clue/profile/${userId}`}>{realName}</Link>
                </span>
                ：
                <Link to={`/latest-clue/detail/${articleId}`}>
                  {articleTitle}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RecommendList;
