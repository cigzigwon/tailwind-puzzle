const HtmlWebpackPlugin          = require('html-webpack-plugin');
const MiniCssExtractPlugin       = require('mini-css-extract-plugin');

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  mode: NODE_ENV,

  entry: './src/js/main.js',

  output: {
    publicPath: '/',
    filename: NODE_ENV === 'development' ? 'js/[name].js' : 'js/bundle.[contenthash].min.js',
    chunkFilename: NODE_ENV === 'development' ? 'js/[name].js' : 'js/[name].[contenthash].min.js'
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendor'
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 2, sourceMap: true } },
          { loader: 'postcss-loader', options: {
            sourceMap: true,
            postcssOptions: {
                plugins: [
                  require('tailwindcss'),
                  require('autoprefixer'),
                ],
              },
            }
          },
          { loader: 'sass-loader', options: { implementation: require('sass'), sourceMap: true } },
        ]
      },
    ],
  },

  devtool : 'source-map',

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/html/index.html'
    }),
  ],
}
