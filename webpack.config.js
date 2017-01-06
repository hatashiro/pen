'use strict';
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


// Always enabled plugins
let plugins = [
  // Extract CSS files to the 'bundle.css'.
  new ExtractTextPlugin('build.css')
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
  context: path.resolve(__dirname, 'src/template/script'),
  output: {
    filename: 'build.js',
    path: `${__dirname}/src/template`
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { presets: ['latest'] }
      }
    ]
  },
  plugins,
};
