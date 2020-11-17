# bi-dashboard

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

****

## Project Configuration

### plugins
- sass: node-sass
- vuetify
- vuex
- eslint: airbnb

### vscode配置
- 启用eslint
- 使用空格缩进
- tab:2
- LF换行

### 项目结构
- src
  - /assets：静态文件
  - /components: 公用组件
  - /directives: 自定义指令
  - /plugins: 插件
  - /store: vuex
  - /style: 样式
  - /mixins：公用的一些代码
  - /views: 视图
  - /site: 一期的系统

### css说明
- global.scss: 全局样式
- theme.scss: 主题变量，暂定组件内部使用css变量方便切换
- variables.scss: 可重写vuetify的sass变量
- 在App.vue中引入重写的d3样式
