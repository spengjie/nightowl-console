import request from '@/utils/request';
import { clone } from '@/utils/objectHelper';

export function fetchEmailSettings() {
  return request({
    url: '/email',
    method: 'get',
  });
}

export function updateEmailSettings(data) {
  data = clone(data);
  data.email = window.$encrypt(data.email);
  data.password = window.$encrypt(data.password);
  return request({
    url: '/email',
    method: 'put',
    data
  });
}

export function testEmailSettings(to_addr, data) {
  data = clone(data);
  data.email = window.$encrypt(data.email);
  data.password = window.$encrypt(data.password);
  data.to_addr = to_addr;
  return request({
    url: '/email/test',
    method: 'post',
    data
  });
}
