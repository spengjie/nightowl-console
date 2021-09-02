import axios from 'axios';
import { MessageBox } from 'element-ui';
import i18n from '@/i18n';
import store from '@/store';
import router from '@/router';
import { resetRouter } from '@/router';

// create an axios instances
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,  // url = base url + request url
  timeout: 90000,  // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      config.headers['Authorization'] = 'Bearer ' + store.getters.token;
    }
    return config;
  },
  error => {
    // do something with request error
    // eslint-disable-next-line no-console
    console.log(error);  // for debug
    return Promise.reject(error);
  }
);


let isReloggingIn = false;  // Identify it is showing re-login dialog or not
let isRefreshing = false;  // Identify it is refreshing token or not
let isChangingPermissions = false;  // Identify it is changing permissions or not
// Re do the unexecuted request after refreshing token
let requests = [];

// response interceptor
service.interceptors.response.use(
  response => {
    const tokenResponse = response.data.token_response;
    const tokenCode = tokenResponse && tokenResponse.error_code;
    if (tokenCode === 20001) {
      const config = response.config;
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = tokenResponse && tokenResponse.token;
        return store.dispatch('user/setToken', newToken).then(() => {
          config.baseURL = '';
          requests.forEach(cb => cb());
          requests = [];
          return service(config);
        }).catch(() => {
          location.reload();
        }).finally(() => {
          isRefreshing = false;
        });
      } else {
        // Return unexecuted resolve Promise
        return new Promise(resolve => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push(() => {
            config.baseURL = '';
            resolve(service(config));
          });
        });
      }
    }
    return response;
  },
  error => {
    if (error.response.status === 403) {
      if (isChangingPermissions) {
        return Promise.reject(error);
      }
      // Permission changed
      isChangingPermissions = true;
      store.dispatch('user/changePermissions').finally(() => {
        isChangingPermissions = false;
        router.replace('/403').catch(() => {});
      });
    } else if (error.response.status === 500) {
      router.push({ name: '500', params: { button: true } }).catch(() => {});
    }
    const tokenResponse = error.response.data.token_response;
    const tokenCode = tokenResponse && tokenResponse.error_code;
    // Invalid token
    if (tokenCode >= 40000 && tokenCode < 50000) {
      if (!isReloggingIn) {
        isReloggingIn = true;
        resetRouter();
        store.dispatch('user/resetToken').then(() => {
          if (location.pathname === '/login') return;
          MessageBox.alert(i18n.t('message.form.invalidSession'), i18n.t('ui.invalidSession'), {
            confirmButtonText: i18n.t('ui.relogin'),
            type: 'info',
            showClose: false,
          }).then(() => {
            if (location.pathname !== '/login') {
              router.push({
                path: '/login',
                query: { redirect: location.pathname + location.search }
              }).catch(() => {});
            }
          }).catch(() => {});
        }).catch(() => {}).finally(() => {
          isReloggingIn = false;
        });
      }
    }
    return Promise.reject(error);
  }
);

export default service;
