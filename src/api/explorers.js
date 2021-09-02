import request from '@/utils/request';

export function fetchExplorers() {
  return request({
    url: '/explorers',
    method: 'get',
  });
}

export function fetchExplorer(explorer_name) {
  return request({
    url: '/explorers/' + explorer_name,
    method: 'get',
  });
}
