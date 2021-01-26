import React from "react";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  articleDetail: any;
}

const ArticleCard: React.FC<ArticleCardProps> = (props) => {
  const { articleDetail } = props;
  return (
    <div className="box-s b-w pading-1 m-b24">
      <h1 className="title-bg02 h-bg04" style={{ paddingLeft: "26px" }}>
        文章内容
      </h1>
      <div className="news-nav">
        您的位置在：<Link to="/">首页</Link>&nbsp;-&nbsp;
        <Link to="/latest-clue/news">文章资讯</Link>
        &nbsp;-&nbsp;<a href="#">前瞻</a>
      </div>
      <div className="bolg-cont">
        <h1>
          {articleDetail.articleTitle}
          <p>
            时间：{articleDetail.publicationTime}　作者：篮
            {articleDetail.realname}　点击：{articleDetail.clickNum} 次
          </p>
        </h1>
        <div
          className="b-cont"
          style={{ minHeight: "826px" }}
          dangerouslySetInnerHTML={{ __html: articleDetail.articleURL }}
        />
      </div>
    </div>
  );
};

export default ArticleCard;
