const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  language: state => state.app.language,
  token: state => state.user.token,
  id: state => state.user.id,
  name: state => state.user.name,
  permissions: state => state.user.permissions,
  visibleRoutes: state => state.permission.permittedRoutes.filter(route => !route.hidden),
};

export default getters;
