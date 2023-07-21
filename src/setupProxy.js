const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/v1*',
    createProxyMiddleware({
      target: 'http://10.10.18.112:8080',
      changeOrigin: true,
    })
  );
};