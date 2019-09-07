let path = require('path')
let nodeExternals = require('webpack-node-externals')

const client = {
  entry: {
    client: './src/client/app.js'
  },
  mode: 'development',
  target: 'web',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}

const server = {
  entry: {
    server: './src/server/index.js'
  },
  mode: 'development',
  target: 'node',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  externals: [nodeExternals()]
}

module.exports = [client, server]
