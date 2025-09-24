const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app){
    app.use(createProxyMiddleware("/res", {
        target: "http://103.145.107.108:17001",
        changeOrigin : true
    }),createProxyMiddleware("/api", {
        target: "http://103.145.107.108:17001",
        changeOrigin : true
    }),createProxyMiddleware("/static", {
        target: "http://103.145.107.108:17001",
        changeOrigin : true
    }),)
}
