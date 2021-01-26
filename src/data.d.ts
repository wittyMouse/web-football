export interface LoginFormData {
  account: string;
  pwd: string;
  captcha?: string;
  type: number;
}

export interface LoginParams extends LoginFormData {
  verificationKey: string;
  verificationCode: string;
}

export interface RegisterFormData {
  account: string;
  pwd: string;
  confirmPwd?: string;
  mobile: string;
  verificationCode: string;
  channelId: string;
  field3?: boolean;
  [propName: string]: any;
}

export interface RegisterParams extends RegisterFormData {
  nickname: string;
  verificationKey: string;
}

export interface UpdateProfileFormData {
  nickname: string;
  oldPwd: string;
  newPwd: string;
  confirmPwd?: string;
  verificationCode: string;
}

export interface UpdateProfileParams extends UpdateProfileFormData {
  token: string;
  verificationKey: string;
}

export interface CheckInInfo {
  dayNum?: number;
  integral?: number;
  isSignIn?: boolean;
}

export interface RequestPhoneCodeParams {
  checkKey: string;
  captcha: string;
}

export interface CaptchaFormData {
  checkKey: string;
  captcha: string;
}
