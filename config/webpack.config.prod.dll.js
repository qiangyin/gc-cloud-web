process.env.NODE_ENV === 'production';

const webpack = require('webpack');
const paths = require('./paths');
const vendors = require('./vendors');
const fs = require('fs-extra');

const shouldUseSourceMap = false;

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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
   // Minify the code.
   new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      // Disabled because of an issue with Uglify breaking seemingly valid code:
      // https://github.com/facebookincubator/create-react-app/issues/2376
      // Pending further investigation:
      // https://github.com/mishoo/UglifyJS2/issues/2011
      comparisons: false,
    },
    mangle: {
      safari10: true,
    },
    output: {
      comments: false,
      // Turned on because emoji and regex is not minified properly using default
      // https://github.com/facebookincubator/create-react-app/issues/2488
      ascii_only: true,
    },
    sourceMap: shouldUseSourceMap,
  }),
    new webpack.DllPlugin({
      path: './public/static/manifest.json',
      name: '[name]_[chunkhash]',
      context: __dirname,
    }),
  ],
};