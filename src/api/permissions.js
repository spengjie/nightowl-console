import request from '@/utils/request';

export function fetchPermissions() {
  return request({
    url: '/permissions',
    method: 'get',
  });
}
