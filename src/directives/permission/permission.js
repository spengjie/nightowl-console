import { checkPermission } from '@/utils/permission';

function checkDirectivePermission(el, binding) {
  const { value } = binding;
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const requiredPermissions = value;
      if (!checkPermission(requiredPermissions)) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin.users:read','assets:read|aws.accounts:read']"`);
  }
}

export default {
  inserted(el, binding) {
    checkDirectivePermission(el, binding);
  },
  update(el, binding) {
    checkDirectivePermission(el, binding);
  }
};
