import request from "../../utils/request";

/**
 * 最新发布
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
 * 根据发布人获取文章分页列表
 * @param token
 */
export function requestMoreArticleList(params: any) {
  return request({
    url: "/api/member/articleListByPage",
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
 * 文章购买
 * @param token
 */
export function requestBuyArticle(params: any) {
  return request({
    url: "/api/member/buyArticle",
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

/**
 * 获取分页榜单列表
 * @param token
 */
export function requestRankingList(data: any) {
  return request({
    url: "/api/member/rankingList",
    method: "post",
    data,
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
 * 文章推介购买
 * @param token
 */
export function requestBuyArticleMarketing(params: any) {
  return request({
    url: "/api/member/buyArticleMarketing",
    method: "post",
    data: params,
  });
}
