const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    port: 3001,
    hot: true,
    liveReload: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
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
        // Add new authentication components
        "./AuthProvider": "./src/AuthContext",
        "./LoginComponent": "./src/LoginComponent", 
        // "./ProtectedComponent": "./src/ProtectedComponent",
      },
      shared: {
        react: { 
          singleton: true,
          requiredVersion: "^18.0.0",
          eager: false
        },
        "react-dom": { 
          singleton: true,
          requiredVersion: "^18.0.0", 
          eager: false
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};