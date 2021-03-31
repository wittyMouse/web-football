import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

interface LatestClueListProps {
  title: string;
  latestArticleList: any[];
}

const LatestClueList: React.FC<LatestClueListProps> = (props) => {
  const { title, latestArticleList } = props;

  return (
    <div className="f_l blog-new">
      <h1 className="title-bg01 h-bg01">
        {title}
        <span>
          <Link to="/latest-clue/index" className="f5">
            更多
          </Link>
        </span>
      </h1>
      <table className="basic-table" style={{ width: "540px", tableLayout: 'fixed' }}>
        <colgroup>
          <col width="80" />
          <col width="120" />
          <col width="340" />
        </colgroup>
        <tbody>
          <tr>
            <th className="p-12">
              时间
            </th>
            <th>专家</th>
            <th>博客文章</th>
          </tr>
          {latestArticleList
            ?.map((item) => {
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
                <tr key={articleId}>
                  <td align="center" className="p-12">
                    {dayjs(publicationTime, "YYYY-MM-DD HH:mm:ss").format(
                      "HH:mm"
                    )}
                  </td>
                  <td>
                    <Link to={`/latest-clue/profile/${userId}`}>
                      {realName}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/latest-clue/detail/${articleId}`}>
                      <div className="text-ellipsis">{articleTitle}</div>
                    </Link>
                  </td>
                </tr>
              );
            })
            .filter((_, index) => index < 10)}
        </tbody>
      </table>
    </div>
  );
};

export default LatestClueList;
