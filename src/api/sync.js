import request from '@/utils/request';

export function startSyncTask() {
  return request({
    url: '/sync/start',
    method: 'post',
  });
}

export function stopSyncTask() {
  return request({
    url: '/sync/stop',
    method: 'post',
  });
}

export function getSyncTaskStatus() {
  return request({
    url: '/sync/status',
    method: 'get',
  });
}
