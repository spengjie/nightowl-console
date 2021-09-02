import clickoutside from './clickoutside';

const install = function(Vue) {
  Vue.directive('clickoutside', clickoutside);
};

if (window.Vue) {
  window.clickoutside = clickoutside;
  Vue.use(install); // eslint-disable-line
}

clickoutside.install = install;
export default clickoutside;
