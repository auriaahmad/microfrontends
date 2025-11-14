// webpack.config.js - Remote App (Updated)
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    port: 3001,
    host: '0.0.0.0',
    hot: true,
    liveReload: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
    allowedHosts: "all"
  },
  output: {
    publicPath: "http://localhost:3001/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteCounter",
      filename: "remoteEntry.js",
      exposes: {
        "./SyncedCounter": "./src/SyncedCounter",
        "./UnsyncedCounter": "./src/UnsyncedCounter",
        // Authentication components
        "./AuthProvider": "./src/AuthContext",
        "./LoginComponent": "./src/LoginComponent",
        // Add Header component
        "./Header": "./src/Header",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false, // Allow any version
          eager: false
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false, // Allow any version
          eager: false
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};