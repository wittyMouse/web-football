const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/df",
    createProxyMiddleware({
      target: "https://www.df1668.com",
      changeOrigin: true,
    })
  );
  // app.use(
  //   "/df_test",
  //   createProxyMiddleware({
  //     target: "https://www.df1668.com",
  //     changeOrigin: true,
  //   })
  // );
};
