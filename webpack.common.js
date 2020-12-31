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
        loader: 'babel-loader',
      },
    ],
  },
};
