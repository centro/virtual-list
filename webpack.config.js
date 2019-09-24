const path = require("path");

/**
 * @see http://webpack.github.io/docs/configuration.html
 * for webpack configuration options
 */
module.exports = {
  context: __dirname + "/src",

  entry: "./VirtualList.jsx",

  output: {
    path: path.resolve(__dirname),
    library: "VirtualList",
    libraryTarget: "umd"
  },

  externals: {
    react: true,
    "prop-types": true
  },

  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};
