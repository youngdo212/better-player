const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const prod = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'better-player.css',
    }),
  ],
  module: {
    rules: [
      ...common.module.rules,
      {
        test: /\.s[ac]ss$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              additionalData: '@import "variables";',
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'src')],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
};

module.exports = [
  merge(common, prod, {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'better-player.js',
      library: 'BetterPlayer',
      libraryTarget: 'umd',
      libraryExport: 'default',
    },
    externals: ['fscreen', 'mime-types', /^lodash\/.+$/, /^core-js\/.+&/],
  }),
  merge(common, prod, {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'better-player.bundle.js',
      library: 'BetterPlayer',
      libraryExport: 'default',
    },
  }),
];
