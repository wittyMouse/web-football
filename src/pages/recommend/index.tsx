import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import Card from "./components/Card";
import RankingList from "./components/RankingList";
import { requestUserInfoByDepartment } from "./service";
import { requestAdConfigInfo } from "../../service";

interface RecommendProps {}

const Recommend: React.FC<RecommendProps> = () => {
  const { token, isLogin } = useSelector((state: RootState) => state.global);
  const [userList1, setUserList1] = useState<any>([]);
  const [userList2, setUserList2] = useState<any>([]);
  const [userList3, setUserList3] = useState<any>([]);
  const [userList4, setUserList4] = useState<any>([]);
  const [userList5, setUserList5] = useState<any>([]);
  const [headerAdv, setHeaderAdv] = useState<any>([]);
  const [footerAdv, setFooterAdv] = useState<any>([]);

  const getUserList = (departId: string, cb: (result: any) => void) => {
    const params = {
      token,
      departId,
    };
    requestUserInfoByDepartment(params).then((res) => {
      if (res.data.code === 0) {
        cb && cb(res.data.result);
      } else {
        console.error(res.data.message);
      }
    });
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
        if (result[4]) {
          setHeaderAdv(result[4]);
        } else if (result[2]) {
          setHeaderAdv(result[2]);
        }
        if (result[5]) {
          setFooterAdv(result[5]);
        } else if (result[3]) {
          setFooterAdv(result[3]);
        }
      }
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isLogin) {
        // 名家指路
        getUserList("1", (result) => {
          setUserList1(result);
        });
        // 预言家
        getUserList("2", (result) => {
          setUserList2(result);
        });
        // 至尊精选推荐
        getUserList("4", (result) => {
          setUserList3(result);
        });
        // 合作机构
        getUserList("5", (result) => {
          setUserList4(result);
        });
        // 至尊赢利套餐
        getUserList("6", (result) => {
          setUserList5(result);
        });
      }
    } else {
      // 名家指路
      getUserList("1", (result) => {
        setUserList1(result);
      });
      // 预言家
      getUserList("2", (result) => {
        setUserList2(result);
      });
      // 至尊精选推荐
      getUserList("4", (result) => {
        setUserList3(result);
      });
      // 合作机构
      getUserList("5", (result) => {
        setUserList4(result);
      });
      // 至尊赢利套餐
      getUserList("6", (result) => {
        setUserList5(result);
      });
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

      <div className="block-c clearfix">
        <div className="f_r b-left">
          <Card title="专家精选推介" userList={userList3} />
          <Card title="合作机构" userList={userList4} />
          <Card title="至尊赢利套餐" userList={userList5} />
        </div>
        <div className="f_l b-right">
          <RankingList title="王牌推介榜" userList={userList1} />
          <RankingList title="劲爆贴士榜" userList={userList2} />
        </div>
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

export default Recommend;
