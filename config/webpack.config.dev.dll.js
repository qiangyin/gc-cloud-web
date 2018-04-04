process.env.NODE_ENV === 'development';

const webpack = require('webpack');
const paths = require('./paths');
const vendors = require('./vendors');
const fs = require('fs-extra');

fs.emptyDirSync(paths.appPublicStatic);

module.exports = {
  output: {
    path: paths.appPublicStatic,
    filename: '[name]_[chunkhash].js',
    library: '[name]_[chunkhash]',
  },
  entry: {
    vendor: vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: './public/static/manifest.json',
      name: '[name]_[chunkhash]',
      context: __dirname,
    }),
  ],
};