"use strict";
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const failPlugin = require("webpack-fail-plugin");
const HTMLInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const HTMLPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

// Always enabled plugins
const plugins = [
  // Extract CSS files to the 'bundle.css'.
  new ExtractTextPlugin("build.css"),
  new HTMLPlugin({
    title: "Pen",
    inlineSource: ".(js|css)$"
  }),
  new HTMLInlineSourcePlugin(),
  // This plugin should be always required. See https://github.com/webpack/webpack/issues/708
  failPlugin
];

// Production only plugins
if (process.env.NODE_ENV === "production") {
  plugins.push(
    // Pass the 'NODE_ENV=production' environment variable to the child processes.
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify("production") }
    })
  );
}

// Configs
module.exports = {
  entry: "./main.js",
  context: path.resolve(__dirname, "src/frontend"),
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.json$/,
        use: "json-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  plugins
};
