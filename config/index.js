// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 9999,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // 产品相关
      '/product': {
        target: 'http://127.0.0.1:8080/v1', // 请求本地后台项目 默认127.0.0.1:8080
        changeOrigin: true,
        pathRewrite: {
          '^/product': '/product'
        } //这里重写路径
      },
      // 用户相关
      '/user': {
        target: 'http://127.0.0.1:8080/v1', // 请求本地后台项目 默认127.0.0.1:8080
        changeOrigin: true,
        pathRewrite: {
          '^/user': '/user'
        } //这里重写路径
      },
      // 订单相关
      '/order': {
        target: 'http://127.0.0.1:8080/v1', // 请求本地后台项目 默认127.0.0.1:8080
        changeOrigin: true,
        pathRewrite: {
          '^/order': '/order'
        } //这里重写路径
      },
      // 产品管理
      '/pm': {
        target: 'http://127.0.0.1:8080/v1', // 请求本地后台项目 默认127.0.0.1:8080
        changeOrigin: true,
        pathRewrite: {
          '^/pm': '/pm'
        } //这里重写路径
      },   
       // 评论相关
      '/comments': {
        target: 'http://127.0.0.1:8080/v1', // 请求本地后台项目 默认127.0.0.1:8080
        changeOrigin: true,
        pathRewrite: {
          '^/comments': '/comments'
        } //这里重写路径
      }

    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
