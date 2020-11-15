module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: [
          '@import "~@/styles/global.scss";',
          '@import "~@/styles/variables.scss"',
        ],
      },
    },
  },
  transpileDependencies: [
    'vuetify',
  ],

  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://zhoujiehui.tech:8888/backend/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },

  // module: {
  //   rules: [
  //     // SCSS与SASS相比有不同的行尾
  //     // 并且在import后面需要分号
  //     {
  //       test: /\.scss$/,
  //       use: [
  //         'vue-style-loader',
  //         'css-loader',
  //         {
  //           loader: 'sass-loader',
  //           // 需要 sass-loader@^8.0.0
  //           options: {
  //             // 这是您的变量文件的路径
  //             prependData: "@import '@/styles/variables.scss';",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
};
