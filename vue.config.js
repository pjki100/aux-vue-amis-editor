const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('amis-core', path.resolve(__dirname, 'src/assets/amis-core'))
  }
};