const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const moduleConfig = {
  rules: [
    ...common.module.rules,
    {
      test: /\.s[ac]ss$/i,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
  ],
};

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: moduleConfig,
});
