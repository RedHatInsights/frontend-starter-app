/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import config from '@redhat-cloud-services/frontend-components-config';

const JSConfig = {
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              experimental: {
                plugins: [
                  [
                    'swc-plugin-coverage-instrument',
                    {
                      compact: false,
                    },
                  ],
                ],
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
            },
          },
        },
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    hashFunction: 'xxhash64',
    path: path.resolve(__dirname, 'dist'),
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, '../.cypress-cache'),
  },
  stats: {
    errorDetails: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
};

const { config: webpackConfig, plugins } = config({
  rootFolder: path.resolve(__dirname, '../'),
});

module.exports = {
  ...JSConfig,
  ...webpackConfig,
  plugins: [
    ...plugins,
    new ModuleFederationPlugin({
      name: 'frontend-starter-app',
      filename: 'frontend-starter-app.js',
      shared: [
        { react: { singleton: true, eager: true } },
        { 'react-dom': { singleton: true, eager: true } },
        { 'react-router-dom': { singleton: true } },
        { '@patternfly/react-core': {} },
      ],
    }),
  ],
};
