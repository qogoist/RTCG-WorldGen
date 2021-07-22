const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/main.ts",
  // entry: "./testsrc/main.ts",
  // entry: "./test.js",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.glsl$/,
        use: "raw-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".glsl"],
    alias: {
      jsm: "three/examples/jsm",
    },
  },
  devServer: {
    contentBase: "build",
    compress: true,
    port: 9000,
    hot: true,
    inline: true,
    watchContentBase: true,
    https: true,
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: "lib-webgl.html",
    // }),
  ],
  output: {
    filename: "main.bundle.js",
    path: path.resolve(__dirname, "build/"),
  },
};
