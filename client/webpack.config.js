var path = require('path');
var ngminPlugin = require('ngmin-webpack-plugin')
module.exports = {
  entry: {
      ext:   path.join(__dirname, '/ext-deps.js'),
      mods:  path.join(__dirname, '/modules/core-deps.js'),
      packs: path.join(__dirname, '/budPacks/packs-deps.js'),
  },
  output: {
      path: path.join(__dirname, 'res'),
      filename: "qibud-[name].js"
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
  },
  plugins: [
    new ngminPlugin() // or, new ngminPlugin({dynamic: true}) for dynamic mode.
  ]
};
