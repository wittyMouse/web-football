import React from "react";
import { Link } from "react-router-dom";

interface ArticleListProps {
  title: string;
  articleList: any;
}

const ArticleList: React.FC<ArticleListProps> = (props) => {
  const { title, articleList } = props;
  return (
    <div className="f_l box-s b-w b-left">
      <h1 className="title-bg02 h-bg04">{title}</h1>
      <ul className="blog-tt">
        {articleList
          ?.filter((_: any, idx: number) => idx < 36)
          ?.map((item: any) => {
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
              <li key={articleId}>
                <p>
                  <b>{amount}</b>币
                </p>
                <span>
                  {/* <Link to={`/latest-clue/profile/${userId}`}>{realName}</Link>： */}
                  <Link to={`/latest-clue/profile/${userId}`}>{realName}</Link>
                  ：
                </span>
                <Link to={`/latest-clue/detail/${articleId}`}>
                  {articleTitle}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default ArticleList;
