const webpack = require('webpack');

module.exports = function override(config) {
  // Ensure proper polyfills for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve('process/browser'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    util: require.resolve('util'),
    zlib: require.resolve('browserify-zlib'),
    vm: require.resolve('vm-browserify'), // Add 'vm' polyfill
  };

  // Provide polyfill plugins
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};
