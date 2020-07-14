const path = require("path");

module.exports = {
  mode: "development", // "production" | "development" | "none"
  entry: "./app/index.js", // 入口文件
  output: {
    path: path.resolve(__dirname, "dist"), // 出口路径
    filename: "bundle.js", // 输出文件名
    publicPath: "/xuni/", // 输出虚拟路径
  },
  module: {
    rules: [
      // {
      // 	test: /\.css$/,
      // 	// 使用 'style-loader','css-loader'
      // 	use: ['style-loader', 'css-loader']
      // },
      // {
      // 	test: /\.less$/,
      // 	use: ['style-loader', 'css-loader', 'less-loader'] // 编译顺序从右往左
      // },
      // {
      // 	test: /\.(png|jpg|gif)$/,
      // 	use: [{
      // 		loader: 'url-loader',
      // 		options: { // 这里的options选项参数可以定义多大的图片转换为base64
      // 			limit: 50000, // 表示小于50kb的图片转为base64,大于50kb的是路径
      // 			outputPath: 'images' //定义输出的图片文件夹
      // 		}
      // 	}]
      // },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // babel 转义的配置选项
            babelrc: false,
            // presets: ['@babel/preset-env', '@babel/preset-react'],
            presets: ["@babel/preset-env"],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  devtool: "source-map",
  //我们在这里对webpack-dev-server进行配置
  devServer: {
    host: "0.0.0.0",
    inline: true, // 用来支持dev-server自动刷新的配置
    hot: true, // 启动webpack热模块替换特性
    port: 9527, //端口号(默认8080)
  },
};
