import { dynamicRoutes, fixedRoutes, staticRoutes } from '@/router';
import { checkPermission } from '@/utils/permission';

/**
 * Use meta.permissions to determine if the current user has permission
 * @param permissions
 * @param route
 */
function checkRoutePermission(route) {
  const routePermissions = route.meta && route.meta.permissions;
  if (routePermissions) {
    return checkPermission(routePermissions);
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes permittedRoutes
 * @param permissions
 */
export function filterPermittedRoutes(routes) {
  const res = [];
  routes.forEach(route => {
    const routeCopy = { ...route };
    if (checkRoutePermission(routeCopy)) {
      if (routeCopy.children) {
        routeCopy.children = filterPermittedRoutes(routeCopy.children);
      }
      res.push(routeCopy);
    }
  });
  return res;
}

const state = {
  routes: [],
  permittedRoutes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.permittedRoutes = routes;
    state.routes = staticRoutes.concat(routes).concat(fixedRoutes);
  }
};

const actions = {
  generatePermittedRoutes({ commit }, permissions) {
    return new Promise((resolve, reject) => {
      try {
        const permittedRoutes = filterPermittedRoutes(dynamicRoutes, permissions);
        commit('SET_ROUTES', permittedRoutes);
        resolve(permittedRoutes);
      } catch (error) {
        reject(error);
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
