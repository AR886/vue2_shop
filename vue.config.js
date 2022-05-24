const path  = require('path')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  },
  // 代理跨域
  devServer: {
    proxy: {
      '/api/private/v1/': {
        target: 'http://127.0.0.1:8888'
        // pathRewrite:{'^api':''}
      }
    }
  }
}
