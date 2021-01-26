import request from "../../utils/request";

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
 * 获取会员信息
 * @param token
 */
export function requestUserInfo(token: string) {
  return request({
    url: "/api/member/getMemberInfo",
    method: "post",
    data: { token },
  });
}

/**
 * 至尊推介订购批量下单
 * @param data
 */
export function requestBatchSubscribe(params: any) {
  return request({
    url: "/api/member/subscribeBatch",
    method: "post",
    data: params,
  });
}
