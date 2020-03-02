const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: {
    main: ['./index.js']
  },
  output: {
    filename: 'js/[name]-bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: ''
  },
  mode: 'development',
  devServer: {
    contentBase: 'dist',
    noInfo: true,
    writeToDisk: true,
    clientLogLevel: 'silent'
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            limit: 10 * 1024
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          'postcss-loader',
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.pug$/,
        use: ['pug-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*']
    }),
    new HtmlWebpackPlugin({
      template: './src/index.pug'
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:8080/',
      reload: false,
      notify: false
    })
  ]
};
