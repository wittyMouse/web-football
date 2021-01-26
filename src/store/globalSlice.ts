import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
  account?: string;
  balance?: number;
  channelId?: string;
  id?: string;
  lastLoginTime?: string;
  memberId?: string;
  mobile?: string;
  nickname?: string;
  pwd?: string;
  registerTime?: number;
  status?: number;
  upgradeTime?: string;
  [propName: string]: any;
}

interface loginState {
  token: string;
  userInfo: UserInfo;
  isLogin: boolean;
}

interface TipsBoxConfig {
  type: string;
  title: string;
  content: any;
}

interface GlobalState extends loginState {
  loginBoxVisible: boolean;
  registerBoxVisible: boolean;
  tipsBoxVisible: boolean;
  tipsBoxConfig: TipsBoxConfig;
}

const initialState: GlobalState = {
  token: "",
  userInfo: {},
  isLogin: false,
  loginBoxVisible: false,
  registerBoxVisible: false,
  tipsBoxVisible: false,
  tipsBoxConfig: {
    type: "",
    title: "",
    content: "",
  },
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setUserInfo(state, action: PayloadAction<UserInfo>) {
      state.userInfo = action.payload;
    },
    setIsLogin(state, action: PayloadAction<boolean>) {
      state.isLogin = action.payload;
    },
    changeLoginStatus(state, action: PayloadAction<loginState>) {
      const { token, userInfo, isLogin } = action.payload;
      state.token = token;
      state.userInfo = userInfo;
      state.isLogin = isLogin;
    },
    setLoginBoxVisible(state, action: PayloadAction<boolean>) {
      state.loginBoxVisible = action.payload;
    },
    setRegisterBoxVisible(state, action: PayloadAction<boolean>) {
      state.registerBoxVisible = action.payload;
    },
    setTipsBoxVisible(state, action: PayloadAction<boolean>) {
      state.tipsBoxVisible = action.payload;
    },
    setTipsBoxConfig(state, action: PayloadAction<TipsBoxConfig>) {
      state.tipsBoxConfig = action.payload;
    },
  },
});

export const {
  setToken,
  setUserInfo,
  setIsLogin,
  changeLoginStatus,
  setLoginBoxVisible,
  setRegisterBoxVisible,
  setTipsBoxVisible,
  setTipsBoxConfig,
} = globalSlice.actions;

export default globalSlice.reducer;
