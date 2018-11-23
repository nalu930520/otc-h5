const tsImportPluginFactory = require('ts-import-plugin')
const analyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const merge = require('deepmerge')
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  parallel: false,
  devServer: {
    disableHostCheck: true,
  },
  chainWebpack: config => {
    config.module
      .rule('ts')
      .use('ts-loader')
        .tap(options => merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true
              })
            ]
          }),
          compilerOptions: {
            module: 'es2015'
          },
        }))
    config.resolve.alias
      .set('@', resolve('src'))
    config.resolve.extensions
      .prepend('.vue')
    config.optimization.splitChunks({
      chunks: 'all',
      name: 'vendors'
    })
    config
      .output
        .chunkFilename('[name].[chunkhash].js')
  }
}