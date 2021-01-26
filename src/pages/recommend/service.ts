import request from "../../utils/request";

/**
 * 根据部门Id获取用户信息
 * @param token
 */
export function requestUserInfoByDepartment(params: any) {
  return request({
    url: "/api/member/selectUserByDepartId",
    method: "post",
    data: params,
  });
}

/**
 * 获取发布会员详细信息
 * @param token
 */
export function requestUserInfo(params: any) {
  return request({
    url: "/api/member/getUserInfo",
    method: "post",
    data: params,
  });
}

/**
 * 至尊推介订购
 * @param token
 */
export function requestSubscribe(params: any) {
  return request({
    url: "/api/member/subscribe",
    method: "post",
    data: params,
  });
}

/**
 * 根据发布人获取至尊推荐分页列表
 * @param token
 */
export function requestRecommendList(params: any) {
  return request({
    url: "/api/member/marketingListByPage",
    method: "post",
    data: params,
  });
}

/**
 * 获取会员信息
 * @param token
 */
export function requestMemberInfo(token: string) {
  return request({
    url: "/api/member/getMemberInfo",
    method: "post",
    data: { token },
  });
}
