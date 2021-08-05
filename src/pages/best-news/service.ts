import request from "../../utils/request";

/**
 * 热点线报
 * @param token
 */
export function requestRecommendArticleList(token: string) {
  return request({
    url: "/api/member/recommendArticleList",
    method: "post",
    data: { token },
  });
}

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
 * 根据部门Id获取用户信息
 * @param token
 */
export function requestBestNews(params: any) {
  return request({
    url: "/api/member/getPageConfigById",
    method: "post",
    data: params,
  });
}

/**
 * 获取分页榜单列表
 * @param token
 */
 export function requestRankingList(data: any) {
  return request({
    url: "/api/member/rankingList",
    method: "post",
    data
  });
}