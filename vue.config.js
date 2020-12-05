module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/styles/global.scss";@import "~@/site/styles/global.scss";',
      },
    },
  },
  transpileDependencies: [
    'vuetify',
  ],

  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },

  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      '/mock': {
        target: 'http://49.232.152.200:8000/backend/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/mock': '',
        },
      },
      '/api': {
        target: 'http://zhoujiehui.tech:8888/backend/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
      // 睿医
      '/real': {
        target: 'http://s.ccnt.xyz:10000/backend/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/real': '',
        },
      },
      '/bi': {
        target: 'http://47.112.221.76:8000/bi/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/bi': '',
        },
      },
    },
  },

  productionSourceMap: false,
};
