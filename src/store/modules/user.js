import { login, logout, authorize } from '@/api/auth';
import { getUserInfo } from '@/api/user';
import router, { fixedRoutes, resetRouter } from '@/router';

const state = {
  token: localStorage.getItem('X-Token'),
  id: '',
  name: '',
  permissions: [],
  oauthState: sessionStorage.getItem('OAuthState'),
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
    if (!token) {
      localStorage.removeItem('X-Token');
    } else {
      localStorage.setItem('X-Token', token);
    }
  },
  SET_ID: (state, _id) => {
    state.id = _id;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
  },
  SET_OAUTH_STATE: (state, oauthState) => {
    state.oauthState = oauthState;
    sessionStorage.setItem('OAuthState', oauthState);
  },
};

const actions = {
  login({ commit }, userInfo) {
    const { username, password, mfa_token, auth_source } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password, mfa_token, auth_source }).then(response => {
        const { error_code, message, token } = response.data;
        if (error_code !== 20000){
          reject({ error_code, message });
        } else {
          commit('SET_TOKEN', token);
          resolve({ error_code, message });
        }
      }).catch(error => {
        reject(error);
      });
    });
  },

  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '');
        commit('SET_ID', '');
        commit('SET_NAME', '');
        commit('SET_PERMISSIONS', []);
        resetRouter();
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        // dispatch('tagsView/delAllViews', null, { root: true })
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },

  authorize({ commit }, payload) {
    const { authCode, redirectUri } = payload;
    return new Promise((resolve, reject) => {
      authorize(authCode, redirectUri).then(response => {
        const { message, token } = response.data;
        commit('SET_TOKEN', token);
        resolve(message);
      }).catch(error => {
        reject(error);
      });
    });
  },

  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        const data = response.data;
        const { _id, name, permissions } = data;
        commit('SET_PERMISSIONS', permissions);
        commit('SET_ID', _id);
        commit('SET_NAME', name);
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  },

  // dynamically modify permissions without refreshing the page
  async changePermissions({ dispatch }) {
    const { permissions } = await dispatch('getInfo');
    // generate permitted routes map based on permissions
    const permittedRoutes = await dispatch('permission/generatePermittedRoutes', permissions, { root: true });
    resetRouter();
    // dynamically add permitted routes
    permittedRoutes.forEach(route => router.addRoute(route));
    fixedRoutes.forEach(route => router.addRoute(route));
  },

  resetToken({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '');
        commit('SET_ID', '');
        commit('SET_NAME', '');
        commit('SET_PERMISSIONS', []);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },

  setToken({ commit }, token) {
    return new Promise(resolve => {
      commit('SET_TOKEN', token);
      resolve();
    });
  },

  setOauthState({ commit }, oauthState) {
    return new Promise(resolve => {
      commit('SET_OAUTH_STATE', oauthState);
      resolve();
    });
  },

};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
