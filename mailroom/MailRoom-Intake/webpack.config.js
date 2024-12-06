
const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  mode: 'none',
  entry: slsw.lib.entries,
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.ts'
    ]
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  externals: [
    {
      'socket.io': 'socket.io',
    },
    /^[a-z\-0-9]+$/,
  ],
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ],
      }
    ]
  }
};