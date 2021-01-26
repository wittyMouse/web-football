import request from "../../utils/request";

/**
 * 获取最早的录音时间
 */
export function requestFirstRecordDate() {
  return request({
    url: "/api/member/findFirstRecordDay",
    method: "post",
  });
}

/**
 * 录音回放列表
 * @param token
 */
export function requestRecordList(params: any) {
  return request({
    url: "/api/member/findRecordList",
    method: "post",
    data: params,
  });
}
