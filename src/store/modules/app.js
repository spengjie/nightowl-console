import { getLanguage } from '@/i18n/index';
import i18n from '@/i18n';

const state = {
  sidebar: {
    opened: localStorage.getItem('sidebarStatus') ? !!+localStorage.getItem('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  pubCert: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs8PAWL5YUdHZP2Rg85y5SLBfm/pA3rXxFlg/hsa+cgeMmjC1WDmF0G+ljwlXxnKHErRbDxQxMfwHi2kFWSvAbsnwRCSPJYQBUteZGDELB0W8cxuCHGZUCk4Hfy9vFjwX/+En7KgO5e4l9dOKzqwbltTfuKsTMaWz6tD6x4YjeWqnnkPJ9jDLezRdatoA5/p3fYFb7uXFOTa7ys03OZrU09yWRbXJkorBmDSYptkszw/k82+FdY0IMLnWOTAQkHsAGViWAVOZ1KryZ1rDUvQLjFuaR/9LdPsGB9KwxulxK3RTAPHzN0u93Wlllr7RfR2N7m6I2Q45P34ZeORFQcXfwQIDAQAB',
  language: getLanguage(),
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      localStorage.setItem('sidebarStatus', 1);
    } else {
      localStorage.setItem('sidebarStatus', 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    localStorage.setItem('sidebarStatus', 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language;
    localStorage.setItem('language', language);
  }
};

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  setLanguage({ commit }, language) {
    i18n.locale = language;
    commit('SET_LANGUAGE', language);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
