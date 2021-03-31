import request from "../../utils/request";

/**
 * 获取文章分类列表
 * @param token
 */
export function requestArticleList(token: string) {
  return request({
    url: "/api/member/articleListByColumn",
    method: "post",
    data: { token },
  });
}

/**
 * 最新文章（线报）列表
 * @param token
 */
export function requestLatestArticleList(params: any) {
  return request({
    url: "/api/member/latestArticleList",
    method: "post",
    data: params,
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