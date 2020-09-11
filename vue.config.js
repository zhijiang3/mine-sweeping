const path = require('path');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  publicPath: isProd ? 'dist/' : '',
  productionSourceMap: !isProd,
  indexPath: path.join(__dirname, './index.html')
};
