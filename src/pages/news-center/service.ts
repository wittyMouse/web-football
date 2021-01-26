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
 * 获取文章信息（包含是否已购买）
 * @param token
 */
export function requestArticleInfo(params: any) {
  return request({
    url: "/api/member/getArticleInfo",
    method: "post",
    data: params,
  });
}

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
