import React, { useState } from "react";
import { Link } from "react-router-dom";

interface TabsProps {
  articleList: any;
}

const Tabs: React.FC<TabsProps> = (props) => {
  const { articleList } = props;
  const [current, setCurrent] = useState<number>(0);

  const onCurrentChange = (idx: number) => {
    setCurrent(idx);
  };

  const tabRender = (_articleList: any) => {
    const tabList: any = [];
    for (
      let i = 0, len = _articleList.length > 20 ? 20 : _articleList.length;
      i < len;
      i += 2
    ) {
      tabList.push(
        <div className="tabs-tr" key={i}>
          {_articleList[i] ? (
            <>
              <div
                className="tabs-td"
                style={{ width: "70px", textAlign: "center" }}
              >
                <Link to={`/latest-clue/profile/${_articleList[i].userId}`}>
                  {_articleList[i].realname}
                </Link>
              </div>
              <div className="tabs-td text-ellipsis" style={{ width: "215px" }}>
                <Link to={`/latest-clue/detail/${_articleList[i].articleId}`}>
                  {_articleList[i].articleTitle}
                </Link>
              </div>
              <div
                className="tabs-td"
                style={{ width: "50px", textAlign: "center" }}
              >
                {_articleList[i].amount}币
              </div>
            </>
          ) : null}
          {_articleList[i + 1] ? (
            <>
              <div
                className="tabs-td"
                style={{ width: "70px", textAlign: "center" }}
              >
                <Link to={`/latest-clue/profile/${_articleList[i + 1].userId}`}>
                  {_articleList[i + 1].realname}
                </Link>
              </div>
              <div className="tabs-td text-ellipsis" style={{ width: "215px" }}>
                <Link
                  to={`/latest-clue/detail/${_articleList[i + 1].articleId}`}
                >
                  {_articleList[i + 1].articleTitle}
                </Link>
              </div>
              <div
                className="tabs-td"
                style={{ width: "50px", textAlign: "center" }}
              >
                {_articleList[i + 1].amount}币
              </div>
            </>
          ) : null}
        </div>
      );
    }
    return tabList;
  };

  return (
    <div className="mt-tabpage" js-tab="3">
      <div className="mt-tabpage-title box-s">
        {articleList?.map((item: any, idx: number) => {
          const { columnId, columnName } = item;
          return (
            <a
              className={`mt-tabpage-item cursor-pointer ${
                current === idx ? "mt-tabpage-item-cur" : ""
              }`}
              key={columnId}
              onClick={() => {
                onCurrentChange(idx);
              }}
            >
              {columnName}
            </a>
          );
        })}
      </div>

      <div className="mt-tabpage-count box-s">
        <div className="tabs-table">
          <div className="tabs-tr">
            <div className="tabs-th" style={{ width: "70px" }}>
              专家名称
            </div>
            <div className="tabs-th" style={{ width: "215px" }}>
              文章标题
            </div>
            <div className="tabs-th" style={{ width: "50px" }}>
              金币
            </div>
            <div className="tabs-th" style={{ width: "70px" }}>
              专家名称
            </div>
            <div className="tabs-th" style={{ width: "215px" }}>
              文章标题
            </div>
            <div className="tabs-th" style={{ width: "50px" }}>
              金币
            </div>
          </div>
          {articleList && articleList.length > 0
            ? tabRender(articleList[current].articleInfoList)
            : null}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
