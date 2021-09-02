const SEG = '/';

export function getPathSegs(pathStr) {
  return pathStr.split(SEG);
}

export function getPathByLevel(pathStr, level) {
  return getPathSegs(pathStr).slice(0, level + 1).join(SEG);
}

export function joinPath(...path) {
  return path.join(SEG);
}

export function searchRoute(routes, name) {
  if (!routes) {
    return null;
  }
  if (Array.isArray(routes)) {
    for (const route of routes) {
      if (route.name === name) {
        return route;
      }
      const childSearch = searchRoute(route.children, name);
      if (childSearch) {
        return childSearch;
      }
    }
  } else {
    if (routes.name === name) {
      return routes;
    }
    const childSearch = searchRoute(routes.children, name);
    if (childSearch) {
      return childSearch;
    }
  }
  return null;
}

export function getQuery(url) {
  const query = {};
  const searchIndex = url.indexOf('?');
  if (searchIndex !== -1) {
      const search = url.slice(searchIndex + 1);
      const paramstrs = search.split('&');
      for (const paramstr of paramstrs) {
        const paramsegs = paramstr.split('=');
        query[paramsegs[0]] = paramsegs[1];
      }
  }
  return query;
}

export function generateUrl(url, params) {
  const queryString = Object.keys(params).map(param => {
    return param + '=' + encodeURIComponent(params[param]);
  }).join('&');
  if (queryString) {
    return url + '?' + queryString;
  }
  return url;
}
