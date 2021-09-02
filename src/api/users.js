import request from '@/utils/request';
import { clone } from '@/utils/objectHelper';

export function addUser(data) {
  data = clone(data);
  data.username = window.$encrypt(data.username);
  data.password = window.$encrypt(data.password);
  return request({
    url: '/users',
    method: 'post',
    data,
  });
}

export function bulkDeleteUsers(users) {
  return request({
    url: '/users/_bulk',
    method: 'delete',
    data: { users },
  });
}

export function queryUsers(query) {
  return request({
    url: '/users/_query',
    method: 'get',
    params: query,
  });
}

export function queryCities() {
  return request({
    url: '/users/_query',
    method: 'get',
    params: { key: 'city' },
  });
}

export function queryDepts() {
  return request({
    url: '/users/_query',
    method: 'get',
    params: { key: 'dept' },
  });
}

export function queryEmails() {
  return request({
    url: '/users/_query',
    method: 'get',
    params: { key: 'email' },
  });
}

export function queryManagers() {
  return request({
    url: '/users/_query',
    method: 'get',
    params: { extra_query: { is_manager: true, disabled: false } },
  });
}

export function queryTitles() {
  return request({
    url: '/users/_query',
    method: 'get',
    params: { key: 'title' },
  });
}

export function searchUsers(start, limit, filters, keyword_filter_keys) {
  return request({
    url: '/users/_search',
    method: 'post',
    data: { start, limit, filters, keyword_filter_keys },
  });
}

export function fetchUser(_id) {
  return request({
    url: '/users/' + _id,
    method: 'get',
  });
}

export function updateUser(data, _id) {
  data = clone(data);
  data.username = window.$encrypt(data.username);
  data.password = window.$encrypt(data.password);
  return request({
    url: '/users/' + _id,
    method: 'put',
    data,
  });
}

export function deleteUser(_id) {
  return request({
    url: '/users/' + _id,
    method: 'delete',
  });
}

export function fetchEmployees() {
  return request({
    url: '/employees',
    method: 'get',
  });
}

export function searchEmployees(filters) {
  return request({
    url: '/employees/_search',
    method: 'post',
    data: { filters },
  });
}
