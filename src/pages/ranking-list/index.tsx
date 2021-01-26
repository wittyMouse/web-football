import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { Link } from "react-router-dom";
import { requestWinningList, requestWinningCountList } from "./service";
import { requestAdConfigInfo } from "../../service";
import jQuery from "jquery";
import jqueryPieLoader from "../../utils/jquery-pie-loader";
import "../../assets/css/jquery-pie-loader.css";
jqueryPieLoader(jQuery);

interface RankingListProps {}

const RankingList: React.FC<RankingListProps> = () => {
  const { token, isLogin } = useSelector((state: RootState) => state.global);
  const [winningListLoading, setWinningListLoading] = useState<boolean>(false);
  const [
    winningCountListLoading,
    setWinningCountListLoading,
  ] = useState<boolean>(false);
  const [winningList, setWinningList] = useState<any>();
  const [winningCountList, setWinningCountList] = useState<any>();
  const [headerAdv, setHeaderAdv] = useState<any>([]);
  const [footerAdv, setFooterAdv] = useState<any>([]);

  // 本周胜率榜
  const getWinningList = () => {
    setWinningListLoading(true);
    requestWinningList(token)
      .then((res) => {
        if (res.data.code === 0) {
          setWinningList(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setWinningListLoading(false);
      });
  };

  // 本周胜场榜
  const getWinningCountList = () => {
    setWinningCountListLoading(true);
    requestWinningCountList(token)
      .then((res) => {
        if (res.data.code === 0) {
          setWinningCountList(res.data.result);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setWinningCountListLoading(false);
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
        if (result[12]) {
          setHeaderAdv(result[12]);
        } else if (result[2]) {
          setHeaderAdv(result[2]);
        }
        if (result[13]) {
          setFooterAdv(result[13]);
        } else if (result[3]) {
          setFooterAdv(result[3]);
        }
      }
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      return;
    }

    getWinningList();
    getWinningCountList();
  }, []);

  useEffect(() => {
    if (isLogin) {
      getWinningList();
      getWinningCountList();
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
      <div className="block-c">
        <img src={require("../../assets/images/index-bt04.png").default} />
        <div className="clearfix" style={{ paddingTop: "24px" }}>
          {winningList?.map((item: any, idx: number) => {
            const { avatar, description, proportion, realname, userId } = item;

            return (
              <div className="f_l box-s b-w fb-x" key={userId}>
                <div className="xb-img">
                  <img src={avatar} alt="avatar" />
                </div>
                <figure
                  className="pie"
                  ref={(el: any) => {
                    (jQuery(el) as any).svgPie({
                      percentage: proportion,
                    });
                  }}
                ></figure>
                <h1>
                  {realname}
                  {idx < 3 ? (
                    <img
                      src={
                        require(`../../assets/images/icon-pm0${idx + 1}.png`)
                          .default
                      }
                    />
                  ) : null}
                </h1>
                <p className="text-ellipsis">{description}</p>
                <div className="fb-enter">
                  <Link to={`/recommend/detail/${userId}`}>点击进入</Link>
                </div>
              </div>
            );
          })}
        </div>
        <img src={require("../../assets/images/index-bt05.png").default} />
        <div className="block-c b-w box-s">
          <div className="tx-all">
            <div className="tx-pp">
              <ul className="tx-pp-x">
                {winningCountList?.map((item: any) => {
                  const {
                    avatar,
                    description,
                    realname,
                    userId,
                    中,
                    推,
                    负,
                    输,
                  } = item;

                  return (
                    <li key={userId}>
                      <div className="data-t">
                        <div
                          className="data-t tx-zhong"
                          style={{ height: `${(中 / 推) * 100}%` }}
                        ></div>
                        <div
                          className="data-t tx-zou"
                          style={{ height: `${(输 / 推) * 100}%` }}
                        ></div>
                        <div
                          className="data-t tx-fu"
                          style={{ height: `${(负 / 推) * 100}%` }}
                        ></div>
                      </div>

                      <Link to={`/recommend/detail/${userId}`}>
                        <img src={avatar} alt="avatar" />
                        {realname}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* 高度为384px */}
          <ul className="bg-txt">
            <li>
              <span>100</span>
            </li>
            <li>
              <span>90</span>
            </li>
            <li>
              <span>80</span>
            </li>
            <li>
              <span>70</span>
            </li>
            <li>
              <span>60</span>
            </li>
            <li>
              <span>50</span>
            </li>
            <li>
              <span>40</span>
            </li>
            <li>
              <span>30</span>
            </li>
            <li>
              <span>20</span>
            </li>
            <li>
              <span>10</span>
            </li>
            <li>
              <span>0</span>
            </li>
          </ul>
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

export default RankingList;
