import React, { useState } from "react";
import { Link } from "react-router-dom";

interface NewsListProps {
  articleList: any;
}

const NewsList: React.FC<NewsListProps> = (props) => {
  const { articleList } = props;
  const [current, setCurrent] = useState<number>(0);
  const changelist = (num: number) => {
    console.log(num);
  };
  return (
    <div className="box-s b-w pading-1 m-b24">
      <h1 className="title-bg02 h-bg04" style={{ paddingLeft: "26px" }}>
        文章资讯
      </h1>
      <div className="news-cag">
        {articleList?.map((item: any, idx: number) => {
          const { articleInfoList, columnId, columnName } = item;
          return (
            <a
              key={columnId}
              className={`cursor-pointer ${current === idx ? "seled" : ""}`}
              onClick={() => {
                setCurrent(idx);
              }}
            >
              {columnName}
            </a>
          );
        })}
      </div>
      <div className="news-list">
        {articleList
          ?.map((item: any, idx: number) => {
            const { columnId, columnName, articleInfoList } = item;
            return (
              <ul key={columnId}>
                {articleInfoList?.map((subItem: any) => {
                  const { articleId, articleTitle } = subItem;
                  return (
                    <li key={articleId}>
                      <Link to={`/latest-clue/article/${articleId}`}>
                        {articleTitle}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            );
          })
          ?.filter((item: any, idx: number) => idx === current)}
      </div>
      <div className="pages">
        <table className="basic-table p-2">
          <tbody>
            <tr>
              <td>
                <a
                  onClick={() => {
                    changelist(1);
                  }}
                >
                  &nbsp;&nbsp;首&nbsp;页&nbsp;&nbsp;
                </a>
              </td>
              <td>
                <ul>
                  <li>
                    <a
                      onClick={() => {
                        changelist(1);
                      }}
                      className="sel"
                    >
                      1
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        changelist(2);
                      }}
                    >
                      2
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        changelist(3);
                      }}
                    >
                      3
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        changelist(4);
                      }}
                    >
                      4
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        changelist(5);
                      }}
                    >
                      5
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        changelist(6);
                      }}
                    >
                      6
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        changelist(7);
                      }}
                    >
                      7
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        changelist(8);
                      }}
                    >
                      8
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        changelist(9);
                      }}
                    >
                      9
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        changelist(10);
                      }}
                    >
                      10
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        changelist(11);
                      }}
                    >
                      11
                    </a>
                  </li>
                </ul>
              </td>
              <td>
                <a
                  onClick={() => {
                    changelist(2);
                  }}
                >
                  &nbsp;&nbsp;下一页&nbsp;&nbsp;
                </a>
              </td>
              <td>
                <a
                  onClick={() => {
                    changelist(18);
                  }}
                >
                  &nbsp;&nbsp;末&nbsp;页&nbsp;&nbsp;
                </a>
              </td>
              <td>
                <select
                  name="sldd"
                  defaultValue="1"
                  //   onchange="changelist(this.options[this.selectedIndex].value);"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                </select>
              </td>
              <td>
                <div>
                  共 <strong>18</strong>页<strong>178</strong>条
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsList;
