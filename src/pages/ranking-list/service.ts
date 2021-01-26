import request from "../../utils/request";

/**
 * 本周胜率榜
 * @param token
 */
export function requestWinningList(token: string) {
  return request({
    url: "/api/member/winningList",
    method: "post",
    data: { token },
  });
}

/**
 * 本周胜场榜
 * @param token
 */
export function requestWinningCountList(token: string) {
  return request({
    url: "/api/member/winningCountList",
    method: "post",
    data: { token },
  });
}
