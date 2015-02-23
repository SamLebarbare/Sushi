var path = require('path');
var ngminPlugin = require('ngmin-webpack-plugin');
var webpack = require('webpack');
module.exports = {
  devtool: "eval",
  entry: {
      css:   path.join(__dirname, '/css-deps.js'),
      ext:   path.join(__dirname, '/ext-deps.js'),
      mods:  path.join(__dirname, '/modules/core-deps.js'),
      packs: path.join(__dirname, '/budPacks/packs-deps.js'),
  },
  output: {
      path: path.join(__dirname, 'res'),
      filename: "qibud-[name].js",
      publicPath: './res/'
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
  },
  module: {
    loaders: [
    {test: /\.css$/,  loader: 'style-loader!css-loader'},
    {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
    {test: /\.png$/,  loader: 'url-loader?limit=100000&mimetype=image/png'},
    {test: /\.gif$/,  loader: 'url-loader?limit=100000&mimetype=image/gif'},
    {test: /\.jpg$/,  loader: 'url-loader?limit=100000&mimetype=image/jpg'},
    {test: /\.(ttf|eot|svg|woff)/, loader: 'file-loader'}
    ]
  },
  plugins: [
    new ngminPlugin({dynamic: true}), // or, new ngminPlugin({dynamic: true}) for dynamic mode.
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15})
  ]
};
