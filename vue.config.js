// vue.config.js
// var saveOrGet = 0 // 正常运行网页（输入“0”）|| 存数据（输入“1”）,会自动结束进程！！
var webpack = require('webpack')

const config = {
  publicPath: '/',
  // 选项...
  devServer: {
    port: 8000, // 端口号
    host: 'localhost',
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器
    hotOnly: true,
    proxy: {
      '/api': {/* 跨域，这里假设有个api地址，前端请求时都要加上 /api/*** ，这里检测到有 /api 时就会执行这里，将 /api/*** 替换成 http://localhost:8080/*** */
        target: 'http://localhost:8080/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }, // 配置多个代理
  parallel: require('os').cpus().length > 1,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      })
    ]
  }
}

// app.use('/', apiRoutes)
module.exports = config
