
const publicPath = process.env.BASE_URL
const apiUrl = process.env.VUE_APP_APIURL
const Timestamp = new Date().getTime()

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  publicPath,
  devServer: {
    publicPath: publicPath,
    port: 6999,
    proxy: {
      '/system': {
        target: apiUrl,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      },
      '/market': {
        target: apiUrl,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      },
      '/api': {
        target: apiUrl,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/personnel': {
        target: apiUrl,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      },
      '/order': {
        target: apiUrl,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      },
      '/learning': {
        target: apiUrl,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      },
      '/education': {
        target: apiUrl,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      },
      '/report': {
        target: apiUrl,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  },
  // css: { loaderOptions: {} },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.output.filename('js/[name].' + Timestamp + '.js').end()
      config.output.chunkFilename('js/[name].' + Timestamp + '.js').end()
      config.plugin('extract-css').tap(() => [{
        filename: `css/[name].${Timestamp}.css`,
        chunkFilename: `css/[name].${Timestamp}.css`
      }])
    }
    config.plugins.delete('prefetch').delete('preload')
    config.resolve.symlinks(true)
    config
      // 开发环境
      .when(['development', 'test', 'sim'].includes(process.env.NODE_ENV),
        // sourcemap不包含列信息
        // config => config.devtool('cheap-source-map')
        config => {
          config.devtool('inline-cheap-source-map')
        }
      )
  },
  configureWebpack: config => {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vant: {
            name: 'vant',
            test: /[\\/]node_modules[\\/]vant[\\/]/,
            priority: -10
          }
        }
      }
    }
  }
}
