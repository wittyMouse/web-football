import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import Pagination from "../../components/Pagination";
import { requesAmountChangeList } from "./service";

interface UserCenterTab4Props {}

const typeList = ["充值", "购买文章", "至尊推荐"];

const UserCenterTab4: React.FC<UserCenterTab4Props> = () => {
  const { token, isLogin } = useSelector((state: RootState) => state.global);
  const [dataSourceLoading, setDataSourceLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState([]);
  const [pages, setPages] = useState({
    pageNo: 1,
    pageSize: 16,
    total: 0,
  });

  const getAmountChangeList = (
    _pages: any = { pageNo: pages.pageNo, pageSize: pages.pageSize }
  ) => {
    setDataSourceLoading(true);
    requesAmountChangeList({
      ..._pages,
      token,
    })
      .then((res) => {
        if (res.data.code === 0) {
          const { total, records } = res.data.result;
          setDataSource(records);
          setPages({
            ...pages,
            total,
          });
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setDataSourceLoading(false);
      });
  };

  /**
   * 修改当前页
   * @param current
   */
  const onPageChange = (current: number) => {
    setPages((pages) => {
      if (pages.pageNo !== current) {
        const _pages = {
          ...pages,
          pageNo: current,
        };
        getAmountChangeList({
          pageNo: _pages.pageNo,
          pageSize: _pages.pageSize,
        });
        return _pages;
      } else {
        return pages;
      }
    });
  };

  useEffect(() => {
    if (isLogin) {
      getAmountChangeList();
    }
  }, [isLogin]);

  return (
    <div>
      <table
        className="basic-table d-table"
        style={{ width: "828px", borderSpacing: 1 }}
      >
        <tbody>
          <tr>
            <th style={{ width: "31%", height: "40px" }}>内容</th>
            <th style={{ width: "14%" }}>备注</th>
            <th style={{ width: "9%" }}>类型</th>
            <th style={{ width: "23%" }}>时间</th>
            <th style={{ width: "12%" }}>交易金额</th>
            <th style={{ width: "11%" }}>余额</th>
          </tr>
          {dataSource?.length > 0 ? (
            dataSource?.map((item) => {
              const {
                id,
                afterAmount,
                amount,
                beforeAmount,
                buyTime,
                description,
                memberId,
                recordId,
                type,
              } = item;
              return (
                <tr key={id}>
                  <td
                    style={{
                      height: "48px",
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {description}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {typeList[type]}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {type === 0 ? "" : typeList[type]}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <p>{buyTime}</p>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {amount}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {afterAmount}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                style={{
                  textAlign: "center",
                  backgroundColor: "#FFFFFF",
                  height: "40px",
                }}
                colSpan={6}
              >
                暂无数据
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {dataSource?.length > 0 ? (
        <div className="clearfix">
          <div className="pages f_r">
            <Pagination
              current={pages.pageNo}
              pageSize={pages.pageSize}
              total={pages.total}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserCenterTab4;
