import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import Pagination from "../../components/Pagination";
import {
  requestSubscribeRecordList,
  requestBatchDeleteBuyRecord,
} from "./service";

interface UserCenterTab2Props {}

const UserCenterTab2: React.FC<UserCenterTab2Props> = () => {
  const { token, isLogin } = useSelector((state: RootState) => state.global);
  const [dataSourceLoading, setDataSourceLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState([]);
  const [pages, setPages] = useState({
    pageNo: 1,
    pageSize: 16,
    total: 0,
  });
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const getAmountChangeList = (
    _pages: any = { pageNo: pages.pageNo, pageSize: pages.pageSize }
  ) => {
    setDataSourceLoading(true);
    requestSubscribeRecordList({
      ..._pages,
      token,
    })
      .then((res) => {
        if (res.data.code === 0) {
          const { total, records } = res.data.result;
          setDataSource(records);
          setPages((pages) => ({
            ...pages,
            total,
          }));
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setDataSourceLoading(false);
      });
  };

  // 批量删除账变记录
  const batchDeleteBuyRecord = (ids: any, cb: () => void) => {
    const params = {
      ids,
      token,
    };
    setDeleteLoading(true);
    requestBatchDeleteBuyRecord(params)
      .then((res) => {
        if (res.data.code === 0) {
          cb && cb();
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  // 多选框状态变化事件
  const onCheckboxChange = (e: any) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRowKeys((selectedRowKeys) =>
        !selectedRowKeys.includes(value)
          ? [...selectedRowKeys, value]
          : selectedRowKeys
      );
    } else {
      setSelectedRowKeys((selectedRowKeys) =>
        selectedRowKeys.filter((key) => key !== value)
      );
    }
  };

  // 全选
  const checkAll = () => {
    setSelectedRowKeys((selectedRowKeys) => {
      if (selectedRowKeys.length !== dataSource.length) {
        return dataSource.map((item) => {
          const { id } = item;
          return id;
        });
      } else {
        return [];
      }
    });
  };

  // 批量删除
  const batchDeleteClick = () => {
    if (deleteLoading) {
      return;
    }
    if (selectedRowKeys.length > 0) {
      batchDeleteBuyRecord(selectedRowKeys, () => {
        setSelectedRowKeys([]);
        setPages((pages) => ({
          ...pages,
          pageNo: 1,
          pageSize: 16,
        }));
        getAmountChangeList();
      });
    } else {
      console.error("请先选择删除项");
    }
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
        setSelectedRowKeys([]);
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
            <th style={{ height: "40px" }} colSpan={2}>
              类型
            </th>
            <th style={{ width: "42%" }}>至尊推介专家名称</th>
            <th style={{ width: "10%" }}>服务状态</th>
            <th style={{ width: "10%" }}>金币</th>
            <th style={{ width: "7%" }}>成绩</th>
            <th style={{ width: "20%" }}>服务起止时间</th>
          </tr>
          {dataSource?.length > 0 ? (
            dataSource?.map((item) => {
              const {
                id,
                amount,
                beginTime,
                endTime,
                realname,
                score,
                status,
              } = item;

              return (
                <tr key={id}>
                  <td
                    style={{
                      width: "4%",
                      height: "48px",
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="checkbox"
                      value={id}
                      checked={selectedRowKeys.includes(id)}
                      onChange={onCheckboxChange}
                    />
                  </td>
                  <td
                    style={{
                      width: "7%",
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    订阅
                  </td>
                  <td style={{ backgroundColor: "#FFFFFF" }}>
                    <div style={{ padding: "0 12px" }}>{realname}</div>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {status ? (
                      <span className="f1">
                        <b>服务中</b>
                      </span>
                    ) : (
                      <span>服务结束</span>
                    )}
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
                    {score > 0 ? (
                      <span className="f1">{score}</span>
                    ) : (
                      <span className="">{score}</span>
                    )}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <p>
                      起：{beginTime}
                      <br />
                      <span style={{ color: "#FF9966" }}>止：{endTime}</span>
                    </p>
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
                colSpan={7}
              >
                暂无数据
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {dataSource?.length > 0 ? (
        <div className="clearfix">
          <div className="m-set f_l">
            <a className="cursor-pointer" onClick={checkAll}>
              全选
            </a>
            <a className="cursor-pointer" onClick={batchDeleteClick}>
              删除所选
            </a>
          </div>
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

export default UserCenterTab2;
