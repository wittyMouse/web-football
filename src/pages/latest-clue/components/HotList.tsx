import React from "react";
import { Link } from "react-router-dom";

interface HotListProps {
  title: string;
  hotList: any;
}

const HotList: React.FC<HotListProps> = (props) => {
  const { title, hotList } = props;
  return (
    <div className="f_r box-s b-w b-right">
      <h1 className="title-bg02 h-bg05">{title}</h1>
      <div className="hotxb">
        <ul>
          {hotList
            ?.filter((_: any, idx: number) => idx < 18)
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
                <li className="text-ellipsis" key={articleId}>
                  <span>
                    <Link to={`/latest-clue/profile/${userId}`}>
                      {realName}
                    </Link>
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

export default HotList;
