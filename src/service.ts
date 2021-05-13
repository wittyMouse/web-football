import request from "./utils/request";
import {
  LoginParams,
  RegisterParams,
  UpdateProfileParams,
  RequestPhoneCodeParams,
} from "./data";

/**
 * 获取验证码
 * @param checkKey
 */
export function requestCaptcha(checkKey: string) {
  return request({
    url: `/sys/randomImage/${checkKey}`,
  });
}

/**
 * 登录
 * @param params
 */
export function requestLogin(params: LoginParams) {
  return request({
    url: "/api/member/login",
    method: "post",
    data: params,
  });
}

/**
 * 注册
 * @param params
 */
export function requestRegister(params: RegisterParams) {
  return request({
    url: "/api/member/register",
    method: "post",
    data: params,
  });
}

/**
 * 退出
 * @param token
 */
export function requestLogOut(token: string) {
  return request({
    url: "/api/member/logout",
    method: "post",
    data: { token },
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
 * 修改会员资料
 * @param token
 */
export function requestUpdateProfile(params: UpdateProfileParams) {
  return request({
    url: "/api/member/updatePassword",
    method: "post",
    data: params,
  });
}

/**
 * 发送短信验证码
 * @param token
 */
export function requestPhoneCode(params: RequestPhoneCodeParams) {
  return request({
    url: "/sys/getPhoneCode",
    method: "post",
    data: params,
  });
}

/**
 * 获取渠道列表
 * @param token
 */
export function requestChannelList() {
  return request({
    url: "/api/member/channelList",
    method: "post",
  });
}

/**
 * 获取广告配置信息
 * @param data
 */
export function requestAdConfigInfo() {
  return request({
    url: "/api/member/getAdConfigInfo",
    method: "post",
  });
}

// /**
//  * 文章购买
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/buyArticle",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 至尊推介订购
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/subscribe",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 获取文章分类列表
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/articleListByColumn",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 获取王牌情报组列表
//  * @param token
//  */
// // export function requestUpdateProfile(params: any) {
// //   return request({
// //     url: "/api/member/aceIntelligenceTeam",
// //     method: "post",
// //     data: params,
// //   });
// // }

// /**
//  * 最新文章（线报）列表
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/latestArticleList",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 热点线报(文章)列表
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/recommendArticleList",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 根据发布人获取文章分页列表
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/articleListByPage",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 根据发布人获取至尊推荐分页列表
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/marketingListByPage",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 会员文章购买记录列表（最新线报推荐）
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/buyRecordListByPage",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 会员至尊订阅记录分页列表(至尊推荐订购)
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/subscribeRecordListByPage",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 本周胜率榜
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/winningList",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 根据部门Id获取用户信息
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/selectUserByDepartId",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 本周胜场榜
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/winningCountList",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 获取发布会员详细信息
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/getUserInfo",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 获取文章信息（包含是否已购买）
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/getArticleInfo",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 录音回放列表
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/findRecordList",
//     method: "post",
//     data: params,
//   });
// }

// /**
//  * 批量删除账变记录
//  * @param token
//  */
// export function requestUpdateProfile(params: any) {
//   return request({
//     url: "/api/member/batchDeleteAmountChange",
//     method: "post",
//     data: params,
//   });
// }

/**
 * 获取登录二维码随机数
 */
export function requestLoginQRCode() {
  return request({
    url: "/api/member/getLoginQRCode",
    method: "post",
  });
}

/**
 * 根据二维码进行登录
 * @param data
 */
export function requestLoginByQRCode(data: any) {
  return request({
    url: "/api/member/loginByQRCode",
    method: "post",
    data,
  });
}

/**
 * 会员根据 CODE（公众号）绑定 OpenId
 * @param data
 */
export function requestBindingOpenIdByCode(data: any) {
  return request({
    url: "/api/member/bindingOpenIdByCode",
    method: "post",
    data,
  });
}
