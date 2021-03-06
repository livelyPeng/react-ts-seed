const {merge} = require('webpack-merge')
const commonConfig = require('./webpack.common')
const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const devWebpackConfig = merge(commonConfig, {
  mode: 'development', // 模式
  output: {
    publicPath: config.dev.assetsPublicPath, // 发布路径
    filename: '[name].js' // 输出文件命名规则
  },
  devtool: config.dev.devtool,
  optimization: {
    moduleIds: 'named' // webapck5替代 4中的 new webpack.NamedModulesPlugin(),
  },
  devServer: {
    hot: true,
    contentBase: false,
    publicPath: config.dev.assetsPublicPath,
    // 非常的关键
    historyApiFallback: {
      rewrites: [{
        from: /./,
        to: config.dev.assetsPublicPath
      }]
    },
    overlay: config.dev.errorOverlay
      ? {warnings: false, errors: true}
      : false,
    host: config.dev.host,
    port: config.dev.port,
    proxy: config.dev.proxyTable,
    quiet: true // necessary for FriendlyErrorsPlugin
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'),
      'CONTEXT_PATH': JSON.stringify(config.dev.assetsPublicPath)
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      templateParameters: {
          PUBLIC_URL: config.dev.assetsSubDirectory,
          title: config.projectTitle
      },
      filename: 'index.html',
      template: utils.resolve('public/index.html'),
      inject: true
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  console.log(portfinder.basePort)
  // 使用portfinder查找可用的端口
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer http
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))
      resolve(devWebpackConfig)
    }
  })
})
