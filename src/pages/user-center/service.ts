import request from "../../utils/request";

/**
 * 获取会员签到信息
 * @param token
 */
export function requesCheckInInfo(token: string) {
  return request({
    url: "/api/member/checkInInfo",
    method: "post",
    data: { token },
  });
}

/**
 * 签到
 * @param token
 */
export function requesCheckIn(token: string) {
  return request({
    url: "/api/member/checkIn",
    method: "post",
    data: { token },
  });
}

/**
 * 会员账变记录
 * @param token
 */
export function requesAmountChangeList(params: any) {
  return request({
    url: "/api/member/amountChangeListByPage",
    method: "post",
    data: params,
  });
}

/**
 * 会员至尊订阅记录分页列表(至尊推荐订购)
 * @param token
 */
export function requestSubscribeRecordList(params: any) {
  return request({
    url: "/api/member/subscribeRecordListByPage",
    method: "post",
    data: params,
  });
}

/**
 * 会员文章购买记录列表（最新线报推荐）
 * @param token
 */
export function requestBuyRecordList(params: any) {
  return request({
    url: "/api/member/buyRecordListByPage",
    method: "post",
    data: params,
  });
}

/**
 * 批量删除账变记录
 * @param token
 */
export function requestBatchDeleteAmountChange(params: any) {
  return request({
    url: "/api/member/batchDeleteAmountChange",
    method: "post",
    data: params,
  });
}

/**
 * 批量删除文章购买记录
 * @param token
 */
export function requestBatchDeleteBuyRecord(params: any) {
  return request({
    url: "/api/member/batchDeleteBuyRecord",
    method: "post",
    data: params,
  });
}

/**
 * 批量删除至尊订阅记录
 * @param token
 */
export function requestBatchDeleteSubscribeRecord(params: any) {
  return request({
    url: "/api/member/batchDeleteSubscribeRecord",
    method: "post",
    data: params,
  });
}

/**
 * 获取充值赠送配置列表
 * @param token
 */
export function requestDonateConfigList() {
  return request({
    url: "/api/member/donateConfigList",
    method: "post",
  });
}

/**
 * 获取签到配置
 * @param token
 */
export function requestSignInConfigList() {
  return request({
    url: "/api/member/signInConfigList",
    method: "post",
  });
}
