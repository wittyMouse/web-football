declare module "slash2";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.tiff";
declare module "omit.js";
declare class WxLogin {
  self_redirect?: boolean;
  id: string;
  appid: string;
  scope: string;
  redirect_uri: string;
  state?: string;
  style?: string;
  href?: string;
  constructor(args: {
    self_redirect?: boolean;
    id: string;
    appid: string;
    scope: string;
    redirect_uri: string;
    state?: string;
    style?: string;
    href?: string;
  }) {
    this.self_redirect = args.self_redirect;
    this.id = args.id;
    this.appid = args.appid;
    this.scope = args.scope;
    this.redirect_uri = args.redirect_uri;
    this.state = args.state;
    this.style = args.style;
    this.href = args.href;
  }
}
declare const WXEnvironment: any
