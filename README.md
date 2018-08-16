# <<深入浅出webpack>>笔记

1. CommentJS规范流行与Node.js采用, 缺点是无法直接在浏览器环境下使用，必须转换成ES5

2. AMD没有原生环境支持, 必须导入第三方库才能使用, 然后可以直接在浏览器里使用

3. ES6模块处理方案是终极解决方式, 但目前也必须转换成ES5才能执行

4. Grunt集成度不高，需要些大量配置才能使用，Gulp加强版, 引入了流，但是还是集成度不高，需要写大量配置

5. Webpack专注处理模块化项目, 开箱即用，但是缺点也是只能处理采用模块化开发的项目

6. npm script里的任务会优先使用本项目下的webpack，可以直接使用本项目下的node_modules里的包的bin文件命令

7. 将一些全局命令包安装到本地用npm调用可以避免版本问题

7. webpack内置了对ES6、CommonJs、AMD的支持

8. webpack-dev-server不会理会webpack.config.js里的output.path值, 会将构建出的文件放在内存中，相应的html里的文件目录要去掉./dist/前缀，直接bundle.js

9. webpack 默认不启动监听模式，需要 webpack --watch 监听, webpack-dev-server 默认开启监听模式, 会在构建出的js里注入一个代理客户端用于开发中的通讯，基于websocket协议

10. 监听模式无法监听 index.html的改动，只监听 entry 本身和 entry依赖链里的文件

11. chunk代码块，一个chunk由多个模块组合而生，用于代码的合并与分割，一个entry及其所有依赖的 module 被分到一个组也就是一个chunk,最后webpack会将所有的chunk转换成文件输出

12. 如果一个entry是一个字符串，chunk的名字是main, 如果entry是一个对象，会生成多个chunk, chunk的名字是键名

13. 一个chunk要输出，可以用 output.filename 指定输出文件名字，如果多个chunk输出，就得借助模板变量，id,name,hash,chunkHash, 如果这个chunk没有输入入口文件，比如CommonChunkPlugun
    那就用chunkFilename配置输出文件名称

14. output.path 是打包输出目录，可以拷贝到资源url下, output.publicPath是生成的资源文件内部引用其他资源文件的url前缀

15. output.path 和 output.publicPath 的目录地址 页支持字符串模板，只有一个代表本次编辑标志的 hash

16. vue-loader 的作用是解析转换 .vue文件，提取其中的 script、style、html template 分别交给对应的 loader css-loader、vue-template-compiler 去处理

17. 现在大多数单页应用的视图都是通过js代码在浏览器端渲染出来的, 比如VUE1.0时，拿到的html是没有数据的, 拿到html后，再拿js/css后再渲染，但是对于复杂的应用，渲染过程计算量大，导致首屏渲染延迟

18. 同构的核心是虚拟DOM, 即不直接操作DOM, 而是通过JS Object描述DOM的的结构，想更新DOM时先更新到JS Object，在映射到DOM, 因为DOM操作是高耗时的操作，将虚拟DOM渲染

19. 同构应用的最终目的是从一份源码中构建传两份JS代码，一份用在浏览器端运行，一份用在Node.js环境运行并渲染出HTML, 在Node端运行的代码不能包含浏览器环境的API因为node不支持, 不能包含css因为目的是渲染内容不是样式,
