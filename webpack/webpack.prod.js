const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')


const clearPath = path.resolve(__dirname, '../dist')

// const regAntd = /[\\/]node_modules[\\/](antd|moment)[\\/]/
const regVendor = /[\\/]node_modules[\\/](axios|classnames|)[\\/]/
const regReact = /[\\/]node_modules[\\/](react|react-dom|react-redux|react-router-config|react-router-dom|react-router-redux|redux)[\\/]/

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  plugins: [
    new CleanWebpackPlugin({ dry: false, verbose: true, cleanOnceBeforeBuildPatterns: [clearPath, clearPath] }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: 'static/css/[name].[contenthash].css',
    }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: `${path.resolve(__dirname, '../public')}/assets`,
    //       to: `${path.resolve(__dirname, '../dist')}/assets`,
    //     },
    //   ],
    //   options: {
    //     concurrency: 100,
    //   },
    // }),
    // new Dotenv({
    //   path: path.resolve(__dirname, '..', '.env.development'),
    // }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
    // instead of having their own. This also helps with long-term caching, since the chunks will only
    // change when actual code changes, not the webpack runtime.
    splitChunks: {
      chunks: 'all',
      minChunks: 3,
      cacheGroups: {
        vendor: {
          test: regVendor,
          name: 'vendor',
          minChunks: 1,
          priority: 10,
          enforce: true,
          chunks: 'all',
        },
        react: {
          test: regReact,
          name: 'react',
          minChunks: 1,
          priority: 10,
          enforce: true,
          chunks: 'all',
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
})