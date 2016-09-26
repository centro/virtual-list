var webpack = require('webpack')

/**
 * @see http://webpack.github.io/docs/configuration.html
 * for webpack configuration options
 */
module.exports = {
  context: __dirname + '/src',

  entry: './VirtualList.jsx',

  output:  {
    library: 'VirtualList',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
