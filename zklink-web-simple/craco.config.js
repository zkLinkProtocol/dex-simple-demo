const CracoEsbuildPlugin = require('craco-esbuild')

module.exports = {
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        // includePaths: ['/external/dir/with/components'], // Optional. If you want to include components which are not in src folder
        esbuildLoaderOptions: {
          // Optional. Defaults to auto-detect loader.
          loader: 'tsx', // Set the value to 'tsx' if you use typescript
          target: 'es2020',
        },
        esbuildMinimizerOptions: {
          // Optional. Defaults to:
          target: 'es2020',
          css: true, // if true, OptimizeCssAssetsWebpackPlugin will also be replaced by esbuild.
        },
        skipEsbuildJest: false, // Optional. Set to true if you want to use babel for jest tests,
        esbuildJestOptions: {
          loaders: {
            '.ts': 'ts',
            '.tsx': 'tsx',
          },
        },
      },
    },
  ],
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.fallback = {
        console: false,
      }

      // Ignore failed source mappings to avoid spamming the console.
      // Source mappings for a package will fail if the package does not provide them, but the build will still succeed,
      // so it is unnecessary (and bothersome) to log it. This should be turned off when debugging missing sourcemaps.
      // See https://webpack.js.org/loaders/source-map-loader#ignoring-warnings.
      webpackConfig.ignoreWarnings = [/Failed to parse source map/]

      // Configure webpack optimization:
      webpackConfig.optimization = Object.assign(
        webpackConfig.optimization,
        process.env.NODE_ENV === 'production'
          ? {
              splitChunks: {
                // Cap the chunk size to 5MB.
                // react-scripts suggests a chunk size under 1MB after gzip, but we can only measure maxSize before gzip.
                // react-scripts also caps cacheable chunks at 5MB, which gzips to below 1MB, so we cap chunk size there.
                // See https://github.com/facebook/create-react-app/blob/d960b9e/packages/react-scripts/config/webpack.config.js#L713-L716.
                maxSize: 5 * 1024 * 1024,
                // Optimize over all chunks, instead of async chunks (the default), so that initial chunks are also optimized.
                chunks: 'all',
              },
            }
          : {}
      )

      return webpackConfig
    },
  },
}
