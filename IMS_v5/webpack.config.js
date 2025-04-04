const path = require("path");
const webpack = require("webpack");

module.exports = {
  resolve: {
    fallback: {
      process: require.resolve("process/browser"),
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert/"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      url: require.resolve("url/"),
      vm: require.resolve("vm-browserify"), // Add vm browserify fallback if not required
    },
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser", // This ensures the `process` polyfill is available globally
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};
