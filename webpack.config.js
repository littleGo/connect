const path = require("path");

module.exports = {
  mode: "production", // "production" | "development" | "none"
  entry: "./app/HB.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "HB.js",
    libraryExport: "default", // 对外暴露default属性，就可以直接调用default里的属性
    library: "HB", // 指定类库名,主要用于直接引用的方式(比如使用script 标签)
    libraryTarget: "umd", // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
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
    port: 9527,
  },
};
