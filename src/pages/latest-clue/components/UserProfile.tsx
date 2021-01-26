import React from "react";
import isEmpty from "lodash/isEmpty";
import "../../../assets/css/jquery-pie-loader.css";
import jQuery from "jquery";
import jqueryPieLoader from "../../../utils/jquery-pie-loader";
jqueryPieLoader(jQuery);

interface UserProfileProps {
  userDetail: any;
}

const UserProfile: React.FC<UserProfileProps> = (props) => {
  const { userDetail } = props;
  return (
    <div className="box-s b-w pading-1">
      <h1 className="title-bg02 h-bg04" style={{ paddingLeft: "26px" }}>
        线人介绍
      </h1>
      {!isEmpty(userDetail) ? (
        <div className="clearfix xr-about">
          <div className="f_l img-data">
            <div className="xb-img">
              <img src={userDetail.avatar} />
            </div>
            <figure
              className="pie"
              ref={(el: any) => {
                (jQuery(el) as any).svgPie({
                  percentage: userDetail.winning,
                });
              }}
            ></figure>
          </div>
          <div className="f_r xr-d">
            <h1>{userDetail.realname}</h1>
            <div>{userDetail.description}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserProfile;
