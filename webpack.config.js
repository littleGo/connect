const path = require("path");

module.exports = {
  mode: "none", // "production" | "development" | "none"
  // entry: "./app/test/HB.js", // 入口文件
  entry: "./app/index.js", // 入口文件
  output: {
    path: path.resolve(__dirname, "dist"), // 出口路径
    // filename: "HB.js", // 输出文件名
    filename: "bundle.js", // 输出文件名
    publicPath: "/xuni/", // 输出虚拟路径
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // babel 转义的配置选项
            babelrc: false,
            presets: ["@babel/preset-env"],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  devtool: "source-map",
  devServer: {
    host: "0.0.0.0",
    inline: true, // 用来支持dev-server自动刷新的配置
    hot: true, // 启动webpack热模块替换特性
    port: 9527, //端口号(默认8080)
  },
};
