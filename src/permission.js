import router, { fixedRoutes, staticRoutes } from './router';
import store from './store';
import { searchRoute } from './utils/path';
import NProgress from 'nprogress'; // progress bar

NProgress.configure({ showSpinner: false }); // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // Start progress bar
  NProgress.start();

  // Determine whether the user has logged in
  const hasToken = store.getters.token;

  if (!hasToken) { // has no token
    // Redirected to the login page if no token.
    // Go directly for static routes
    if (staticRoutes.find(route => to.path !== '/' && route.path === to.path)) {
      next();
    } else {
      next( { path: '/login', query: { redirect: to.fullPath } });
      NProgress.done();
    }
    return;
  }

  // Check whether the user has obtained its info
  const retrievedUserInfo = store.getters.id;
  if (retrievedUserInfo) {
    const visibleRoutes = store.getters.visibleRoutes;
    if (visibleRoutes.length === 0) {
      await store.dispatch('user/resetToken');
      next({ path: '/403' });
      NProgress.done();
      return;
    }
    // If logged in, redirect to the page set in query or '/'
    if (to.path === '/login') {
      const query = to.query;
      const redirect = (query && query.redirect) || '/';
      next({ path: redirect });
      NProgress.done();
    }
    // Redirect to the first child for the routes need redirect
    else if (to.meta && to.meta.redirect) {
      const visibleRoute  = searchRoute(visibleRoutes, to.name);
      if (visibleRoute && visibleRoute.children && visibleRoute.children.length) {
        const firstChild = visibleRoute.children[0];
        next({ name: firstChild.name });
        NProgress.done();
      } else {
        // Redirect to the first visible route for '/' if it has no children
        if (to.path === '/') {
          next({ path: visibleRoutes[0].path, replace: true});
          NProgress.done();
        } else {
          next();
        }
      }
    } else {
      next();
    }
  } else {
    try {
      // Get user info
      await store.dispatch('user/getInfo');

      // Generate permitted routes map based on permissions
      const permittedRoutes = await store.dispatch('permission/generatePermittedRoutes');
      // Dynamically add permitted routes
      permittedRoutes.forEach(route => router.addRoute(route));
      fixedRoutes.forEach(route => router.addRoute(route));

      // Hack method to ensure that addRoutes is complete
      // Set the replace: true, so the navigation will not leave a history record
      next({ ...to, replace: true });
      NProgress.done();
    } catch (error) {
      // Reset token and go to login page to re-login
      await store.dispatch('user/resetToken');

      if (to.path === '/login') {
        next();
      } else {
        next( { path: '/login', query: { redirect: to.fullPath } });
        NProgress.done();
      }
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
