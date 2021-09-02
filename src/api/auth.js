import request from '@/utils/request';
import { clone } from '@/utils/objectHelper';

export function fetchAuthSettings() {
  return request({
    url: '/auth',
    method: 'get',
  });
}

export function updateAuthSettings(data) {
  data = clone(data);
  if (data.sso) {
    data.sso.client_secret = window.$encrypt(data.sso.client_secret);
    data.sso.username = window.$encrypt(data.sso.username);
    data.sso.password = window.$encrypt(data.sso.password);
  }
  return request({
    url: '/auth',
    method: 'put',
    data,
  });
}

export function login(data) {
  data = clone(data);
  data.username = window.$encrypt(data.username);
  data.password = window.$encrypt(data.password);
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  });
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
}

export function authorize(code, redirect_uri) {
  return request({
    url: '/auth/authorization_code',
    method: 'post',
    data: { code, redirect_uri },
  });
}

export function fetchAuthSso(redirect) {
  return request({
    url: '/auth/sso',
    method: 'get',
    params: { 'redirect_uri': redirect },
  });
}
