import React, { useState, useEffect, useMemo } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/index";
import { setTipsBoxVisible, setTipsBoxConfig } from "../../store/globalSlice";
import { OrderMap } from "./data";
import { requestAdConfigInfo } from "../../service";

interface ShopCarProps extends RouteChildrenProps {}

const ShopCar: React.FC<ShopCarProps> = (props) => {
  const { history } = props;
  const { isLogin, userInfo } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  const [orderList, setOrderList] = useState<any[]>([]); // 订单列表
  const [checkAll, setCheckAll] = useState<boolean>(false); // 全选状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]); // 选中项列表
  const [headerAdv, setHeaderAdv] = useState<any>([]);
  const [footerAdv, setFooterAdv] = useState<any>([]);

  const orderMap: OrderMap = {
    0: {
      label: "单日",
      dataIndex: "dayAmount",
      unit: "金币",
    },
    1: {
      label: "包周",
      dataIndex: "weekAmount",
      unit: "金币",
    },
    3: {
      label: "单日积分",
      dataIndex: "dayAmount",
      unit: "积分",
    },
  };

  const computeTotalValue = (orderList: any, selectedRowKeys: string[]) => {
    let sum = 0;
    orderList.forEach((item: any) => {
      const { id, type, dayAmount, weekAmount } = item;
      if (selectedRowKeys.includes(id)) {
        if (type === 0 || type === 1) {
          sum += type === 0 ? dayAmount : weekAmount;
        }
      }
    });
    return sum;
  };

  const computeTotalPointsValue = (
    orderList: any,
    selectedRowKeys: string[]
  ) => {
    let sum = 0;
    orderList.forEach((item: any) => {
      const { id, type, dayAmount } = item;
      if (selectedRowKeys.includes(id)) {
        if (type === 3) {
          sum += dayAmount * 10;
        }
      }
    });
    return sum;
  };

  const total = useMemo(() => computeTotalValue(orderList, selectedRowKeys), [
    orderList,
    selectedRowKeys,
  ]);

  const totalPoints = useMemo(
    () => computeTotalPointsValue(orderList, selectedRowKeys),
    [orderList, selectedRowKeys]
  );

  // 多选框状态变化事件
  const onCheckboxChange = (e: any) => {
    const { name, value, checked } = e.target;

    switch (name) {
      case "checkbox":
        if (checked) {
          setSelectedRowKeys((selectedRowKeys) => {
            let _selectedRowKeys = selectedRowKeys;

            if (!_selectedRowKeys.includes(value)) {
              _selectedRowKeys = [...selectedRowKeys, value];
            }

            // 判断是否全选
            if (_selectedRowKeys.length === orderList.length) {
              setCheckAll(true);
            }

            return _selectedRowKeys;
          });
        } else {
          // 取消全选状态
          if (checkAll) {
            setCheckAll(false);
          }

          setSelectedRowKeys((selectedRowKeys) => {
            const _selectedRowKeys = selectedRowKeys.filter(
              (key) => key !== value
            );

            return _selectedRowKeys;
          });
        }
        break;
      case "all":
        if (checked) {
          // 勾选所有多选框
          const _selectedRowKeys = orderList.map((item) => item.id);
          setSelectedRowKeys(_selectedRowKeys);
        } else {
          // 取消勾选所有多选框
          setSelectedRowKeys([]);
        }
        setCheckAll(checked);
        break;
    }
  };

  // 删除按钮
  const onDeleteClick = () => {
    if (selectedRowKeys.length === 0) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "请先选择删除项",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    }

    // 删除订单
    setOrderList((orderList: any[]) => {
      const _orderList = orderList.filter(
        (item) => !selectedRowKeys.includes(item.id)
      );
      window.localStorage.setItem(
        `${userInfo.id}-orderList`,
        JSON.stringify(_orderList)
      );
      return _orderList;
    });

    // 清空选中
    setSelectedRowKeys([]);

    dispatch(
      setTipsBoxConfig({
        type: "success",
        title: "操作成功",
        content: "已删除选中项",
      })
    );
    dispatch(setTipsBoxVisible(true));
  };

  // 结算按钮
  const onPayClick = () => {
    if (selectedRowKeys.length === 0) {
      dispatch(
        setTipsBoxConfig({
          type: "warning",
          title: "提示",
          content: "没有选中的订单",
        })
      );
      dispatch(setTipsBoxVisible(true));
      return;
    }

    const selectedOrderIds = selectedRowKeys.join(",");
    window.sessionStorage.setItem("selectedOrderIds", selectedOrderIds);
    history.push("/latest-clue/check-order");
  };

  const getAdConfigInfo = (cb: (result: any) => void) => {
    requestAdConfigInfo().then((res) => {
      if (res.data.code === 0) {
        cb && cb(res.data.result);
      } else {
        console.error(res.data.message);
      }
    });
  };

  useEffect(() => {
    getAdConfigInfo((result) => {
      if (result) {
        if (result[2]) {
          setHeaderAdv(result[2]);
        }
        if (result[3]) {
          setFooterAdv(result[3]);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (isLogin) {
      let _orderList: any = window.localStorage.getItem(
        `${userInfo.id}-orderList`
      );
      if (_orderList) {
        _orderList = JSON.parse(_orderList);
        setOrderList(_orderList);
      }
    } else {
      // 退出后清空订单列表
      setOrderList((orderList: any[]) => {
        if (orderList.length > 0) {
          return [];
        }
        return orderList;
      });
      window.sessionStorage.removeItem("selectedOrderIds");
    }
  }, [isLogin]);

  return (
    <div>
      <div className="top-gg box-s">
        <img
          className="cursor-pointer"
          src={headerAdv && headerAdv.length > 0 ? headerAdv[0].imageUrl : ""}
          alt="adv"
          onClick={() => {
            if (headerAdv[0].pageUrl) {
              window.location.href = headerAdv[0].pageUrl;
            }
          }}
        />
      </div>

      <div className="cart-bg">
        {orderList?.length > 0 ? (
          <table className="basic-table" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <th style={{ width: "5%", height: "40" }}>&nbsp;</th>
                <th style={{ width: "58%" }}>专家名称</th>
                <th style={{ width: "20%" }}>服务类型</th>
                <th style={{ width: "17%" }}>金币/积分</th>
              </tr>
              {orderList?.map((item) => {
                const { id, realname, avatar, type } = item;

                return (
                  <tr key={id}>
                    <td style={{ height: "80px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        name="checkbox"
                        value={id}
                        checked={selectedRowKeys.includes(id)}
                        onChange={onCheckboxChange}
                      />
                    </td>
                    <td>
                      <dl>
                        <dd>
                          <img src={avatar} alt="avatar" />
                        </dd>
                        <dt>{realname}</dt>
                      </dl>
                    </td>
                    <td>{orderMap[type].label}</td>
                    <td>
                      {type === 3
                        ? item[orderMap[type].dataIndex] * 10
                        : item[orderMap[type].dataIndex]}
                      {orderMap[type].unit}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td style={{ height: "60px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    name="all"
                    checked={checkAll}
                    onChange={onCheckboxChange}
                  />
                </td>
                <td colSpan={3} className="clearfix">
                  <div className="f_l">
                    全选&nbsp;&nbsp;&nbsp;&nbsp;
                    <a className="c-del cursor-pointer" onClick={onDeleteClick}>
                      删除
                    </a>
                  </div>
                  <div className="f_r">
                    已选 {selectedRowKeys.length} 个服务，共
                    <b className="fc1">{total}</b>金币、
                    <b>{totalPoints}</b>积分
                    <a className="bat-js cursor-pointer" onClick={onPayClick}>
                      结 算
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="cart-ndate">购物车暂无数据</div>
        )}
      </div>

      <div className="foot-gg box-s">
        <img
          className="cursor-pointer"
          src={footerAdv && footerAdv.length > 0 ? footerAdv[0].imageUrl : ""}
          alt="adv"
          onClick={() => {
            if (footerAdv[0].pageUrl) {
              window.location.href = footerAdv[0].pageUrl;
            }
          }}
        />
      </div>
    </div>
  );
};

export default ShopCar;
