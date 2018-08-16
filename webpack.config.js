'use strict';

const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const DefinePlugin = require('')
const UglifyJsPlugin = require('')

module.exports = {

  context: __dirname, //寻找相路径文件时的根目录, 默认启动时当前工作目录
  entry: './main.js',
  // entry: ['./main1.js', './main2.js'], //只生成一个trunk, 名称为main
  // entry: { //生成多个trunk, 名称是键名
  //  a: './main.js',
  //  b: ['./main1.js', './main2.js'],
  // }
  // entry: () => { //可以是异步获取的, 比如读取文件目录
  //   return new Promise(resolve => {
  //     resolve({
  //        a: './main.js',
  //        b: ['./main1.js', './main2.js'],
  //     })
  //   })
  // },
  output: {
    //path和publichash都支持字符串模 [hash], 代表一次编译操作的hash值
    path: path.resolve(__dirname, './dist/[hash]/'),
    //发布到线上资源的url前缀，默认''，使用相对index.html路径
    //这时候xxx.html里的资源引用 src=http://cdn.xxx.com/assets/abc.js
    publicPath: 'http://cdn.xxx.com/assets/[hash]/',

    filename: 'bundle.js',
    //filename: '[name]_[hash]_[chunkhash].js',
    chunkFileName: '[name]_[hash]_[chunkhash].js', //配置无入口的chunk在输出时的文件名称， 比如CommonChunkPlugin, import('module-path')动态加载的

    corssOriginLoading: 'user-credentials', //加载脚本资源带上用户cookies，用于异步加载代码块使用JOSNP时的校验

    //当构建一个可以被其他模块导入使用的库时
    libraryTarget: 'commonjs2', //导出库的方式 有var commonjs commonjs2 this window global, 常用commonjs2
    library: '导出库的名称', //commonjs commonjs2时没意义，默认lib_code
    libraryExport: '子模块名称' //commonjs commonjs2 才有意义
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // test: [
        //   /\.css$/,
        //   /\.scss$/
        // ]
        //下面两个个参数 也支持数组
        include: path.resolve(__dirname, 'src'), //只从src下命中文件转换
        exclude: path.resolve(__dirname, 'node_modules'), //排除node_modules下的文件检查

        //执行顺序由右到左，querystring方式传入参数
        use: [
          'style-loader',
          'css-loader?minimize',
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }
          //也可以 load = require('style-loader!css-loader?minimize!./main.css')  load.then()
        ],
        //use: ExtractTextPlugin.extract({
        //  use: ['css-loader?minimize']
        //}),
        loaders: ExtractTextPlugin.extract({
          use: ['css-loader']
        }),
        enforce: 'post|pre', //将该loader的执行顺序放到 最后面|最前面

        noParse: /jquery|chartjs/, //让webpack忽略 没采用模块化的文件的解析和处理，提高构建性能，只是不解析，并不是不适用
        // noParse: (filepath) => {
        //   return /jquery|chartjs/.test(filepath)
        // }

        parser: {} //禁用一些解析支持，没啥用
      },
    ]
  },
  plugins: [
    //从.js文件中提取出来的.css文件的名称
    new ExtractTextPlugin({
      filename: '[name]_[contenthash:8].css' //contenthash根据文件内容算出的hash, 不用chunkhash是因为Plugin直接拿到了源文件，而不是编译中间thunk
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production') //取出源码中只有开发时采用的部分
      }
    }),
    new UglifyJsPlugin({
      //最紧凑的输出, 紧凑就是丑, 去掉换行什么的
      beautify: false,
      //删除所有注释
      comments: false,
      //压缩参数
      compress: {
        //删除没有用到的代码时不输出警告
        warnings: false,
        //删除所有console语句
        drop_console: true,
        //内嵌已定义但是只用到一次的变量
        collapse_vars: true,
        //提取出现多次但是没有定义成变量的静态值
        reduce_vars: true
      }
    })
  ],
  //配置webpack如果寻找所有依赖的模块对应的文件
  resolve: {//对模块导入功能，即 require 函数的强化
    alias: { //将原导入路径 映射 成 新导入路径，进行导入操作
      components: './src/components/', //替换路径 import Button from 'components/button' 为 import Button from './srccomponents/button'
      'react$': '/path/react.js', //import 'react'
    },
    extensions: ['.js', '.json'], //当导入语句没带后缀时，自动带上后缀访问文件是否存在
    //指明入口文件位置的字段，根据这个决定优先采用哪部分代码，因为一些第三方模块会在不同环境提供不同的代码入口
    mainFields: ['browser', 'main'],
    modules: [ //配置Webpack去哪些目录下寻找第三方模块
      './src/components',
      'node_modules' // 默认只会沿着 node_moudles目录寻找
    ],
    enforceExtension: false, //强制所有导入语句都必须带后缀，也没啥用, 导入第三方模块一般都不带后缀
    enforceModuleExtension: false, //如果上一参数为true  这个参数将第三方模块排除在外
  },

  //只有webpack-dev-server启动时，才用到该配置
  devServer: {
    hot: true,  //模块热替换
    inline: true, //是否将代理客户端自动注入到页面的chunk里，默认自动注入，该参数影响webpack的自动刷新策略，
    // 默认代理客户端控制，否则需要去 http://localhost:8080/webpack-dev-server 下看
    historyApiFallback: true, //默认都返回一个html，只用于只有一个页面的应用
    // historyApiFallback: {
    //   rewrites: [ //不同请求返回不同页面
    //     {from: '/user', to: '/user.html'}
    //   ]
    // }
    contentBase: path.resolve(__dirname, 'public'), //服务器文件的根目录, 默认当前执行目录，用于暴露本地文件(如果有引用的话)，打包生成的文件都在内存中
    headers: {
      //响应头
    },
    host: '127.0.0.1', //监听地址
    port: 8080, //监听端口
    allowHosts: [], //白名单列表
    deiableHostCheck: false, //关闭host域名检查，主要想让其他设备可以直接通过ip访问自己的本地服务
    https: true, //webpack-dev-server会自动帮我们生成一份证书
    // https: {
    //   key: '',
    //   cert: '',
    //   ca: ''
    // }
    compress: false, //是否卡其gzip压缩
    open: true //是否构建完打开内置浏览器
  },

  devtool: 'source-map', //默认不生成 Source Map
  watch: false, // 监听模式开关
  //判断文件编号是通过不停的询问文件系统指定文件有没有变化实现的
  watchOptions: {
    ignored: '/node_modules/',
    aggregateTimeout: 300, //监听到变化后等300ms执行动作
    poll: 1000 //每秒询问1000
  },

  //一般一些公共外部模块会注入一些全局变量，如jQuery, 在代码里再次引用，打包会造成出现两次
  //最好是Chunk里不包含jQuery库的内容
  externals: {
    //告诉webpack在Javascript里已经内置了哪些全局变量，不用再次打包到thunk，而是直接使用
    jquery: 'jQuery' // import jquery from 'jQuery' 直接替换，不打包
  },

  resolveLoader: {
    //去哪个文件夹下面找Loader
    modules: ['node_modules'],
    //loader入口文件的后缀
    extensions: ['.js', '.json'],
    //指明入口文件位置的字段，因为一些第三方模块会在不同环境提供不同的代码入口
    mainFields: ['loader', 'main']
  }
}