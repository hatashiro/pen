'use strict';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const failPlugin = require('webpack-fail-plugin');
const HTMLInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');


// Always enabled plugins
let plugins = [
  // Extract CSS files to the 'bundle.css'.
  new ExtractTextPlugin('build.css'),
  new HTMLPlugin({
    title: 'Pen',
    inlineSource: '.(js|css)$'
  }),
  new HTMLInlineSourcePlugin(),
  // This plugin should be always required. See https://github.com/webpack/webpack/issues/708
  failPlugin,
];

// Production only plugins
if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    // Pass the 'NODE_ENV=production' environment variable to the child processes.
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    // Minimize the output
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
  ]);
}


// Configs
module.exports = {
  entry: './main.js',
  context: path.resolve(__dirname, 'src/frontend'),
  output: {
    filename: 'build.js',
    path: './'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      }
    ]
  },
  plugins,
};
