module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.m?(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/typescript',
              [
                '@babel/preset-env',
                {
                  targets: {
                    ie: '10',
                  },
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
