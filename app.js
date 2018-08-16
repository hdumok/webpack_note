'use strict';

const express = require('express')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')

const config = require('/webpack.config')

const app = express()

const compiler = webpack(config);

//wepack-dev-middleware能够将 DevServer 集成到现有的HTTP服务器中
//让现有的HTTP服务器直接能返回webpack构建出的内容，而不是启动两次http服务器
app.use(webpackMiddleware(compiler, {
  // webpack-dev-middleware options
}))

app.listen(3000)