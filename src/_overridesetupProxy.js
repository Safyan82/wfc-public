const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/graphql',
    createProxyMiddleware({
      target: 'http://134.209.22.223', // Replace with the URL of your GraphQL backend
      changeOrigin: true,
    })
  );
};
