import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import Pagination from "../../components/Pagination";
import {
  requesAmountChangeList,
  requestBatchDeleteAmountChange,
} from "./service";

interface UserCenterTab1Props {}

const UserCenterTab1: React.FC<UserCenterTab1Props> = () => {
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
    requesAmountChangeList({
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
  const batchDeleteAmountChange = (ids: any, cb: () => void) => {
    const params = {
      ids,
      token,
    };
    setDeleteLoading(true);
    requestBatchDeleteAmountChange(params)
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
      batchDeleteAmountChange(selectedRowKeys, () => {
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
        style={{ width: "828px", borderSpacing: 1, backgroundColor: "#dddddd" }}
      >
        <tbody>
          <tr>
            <th style={{ height: "40px" }} colSpan={2}>
              订单号
            </th>
            <th style={{ width: "39%" }}>产品</th>
            <th style={{ width: "11%" }}>状态</th>
            <th style={{ width: "17%" }}>时间</th>
          </tr>
          {dataSource?.length > 0 ? (
            dataSource?.map((item, i) => {
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
                      width: "5%",
                      height: "42px",
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
                      width: "28%",
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {recordId}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <span>{amount}</span>
                    <span>金币</span>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <span className="f1">已付款</span>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {buyTime ? (buyTime as string).split(" ")[0] : ""}
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
                colSpan={5}
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

export default UserCenterTab1;
