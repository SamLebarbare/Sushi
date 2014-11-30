var path = require('path');
module.exports = {
  entry: {
      ext:   path.join(__dirname, '/ext-deps.js'),
      mods:  path.join(__dirname, '/modules/core-deps.js'),
      packs: path.join(__dirname, '/budPacks/packs-deps.js'),
  },
  output: {
      path: path.join(__dirname, 'dist'),
      filename: "qibud-[name].js"
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
  }
};
