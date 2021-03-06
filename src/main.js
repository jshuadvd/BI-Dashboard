import Vue from 'vue';
import { Icon } from 'leaflet';
import App from './site/App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import router from './site/router';
import 'leaflet/dist/leaflet.css';

// 删掉获得url的方法，(●ˇ∀ˇ●)!
delete Icon.Default.prototype._getIconUrl;

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app');
