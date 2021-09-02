import ElementUI from 'element-ui';
import 'nprogress/nprogress.css'; // progress bar style
import '@/styles/index.scss'; // global css
import Vue from 'vue';
import JSEncrypt from 'jsencrypt';
import router from './router';
import store from './store';
import i18n from './i18n'; // internationalization

import App from './App.vue';
import Icon from './components/Icon/index.vue';
import permission from './directives/permission';
import clickoutside from './directives/clickoutside';
import './permission';

Vue.use(ElementUI, {
  i18n: (key: string, value: string) => i18n.t(key, value),
  size: 'medium',
});
Vue.use(permission);
Vue.use(clickoutside);
Vue.use(Icon);

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');

const jsEncrypt = new JSEncrypt();
jsEncrypt.setPublicKey(store.state.app.pubCert);
(window as any).$encrypt = (data: any): any => {
  if (typeof(data) !== 'string') return data;
  return jsEncrypt.encrypt(data);
}
