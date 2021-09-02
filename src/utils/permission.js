import store from '@/store';

function getRegExp(exp) {
  const regExpSegs = [];
  exp.split('.').map(seg => {
    return seg.replace('*', '[\\w.]+');
  })
  .forEach((item, index, array) => {
    regExpSegs.push(array.slice(0, array.length - index).join('\\.'));
  });
  return `(${regExpSegs.join('|')})`;
}

export function checkPermission(requiredPermissions) {
  const permissions = store.getters && store.getters.permissions;
  for (const requiredPermission of requiredPermissions) {
    let permitted = false;
    for (const orPermission of requiredPermission.split('|')) {
      const exp = orPermission.split(':');
      const regex = new RegExp(`^${getRegExp(exp[0])}:${getRegExp(exp[1])}$`, 'i');
      for (const permission of permissions) {
        if (regex.test(permission)) {
          permitted = true;
          break;
        }
      }
    }
    if (!permitted) {
      return false;
    }
  }
  return true;
}
