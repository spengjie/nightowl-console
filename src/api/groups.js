import request from '@/utils/request';

export function addGroup(data) {
  return request({
    url: '/groups',
    method: 'post',
    data,
  });
}

export function bulkDeleteGroups(groups) {
  return request({
    url: '/groups/_bulk',
    method: 'delete',
    data: { groups },
  });
}

export function fetchGroupsInfo() {
  return request({
    url: '/groups/_info',
    method: 'get',
  });
}

export function queryGroups(query) {
  return request({
    url: '/groups/_query',
    method: 'get',
    params: query,
  });
}

export function searchGroups(start, limit, filters, keyword_filter_keys) {
  return request({
    url: '/groups/_search',
    method: 'post',
    data: { start, limit, filters, keyword_filter_keys },
  });
}

export function fetchGroup(_id) {
  return request({
    url: '/groups/' + _id,
    method: 'get',
  });
}

export function updateGroup(data, _id) {
  return request({
    url: '/groups/' + _id,
    method: 'put',
    data,
  });
}

export function deleteGroup(name) {
  return request({
    url: '/groups/' + name,
    method: 'delete',
  });
}
