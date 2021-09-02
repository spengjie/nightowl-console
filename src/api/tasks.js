import request from '@/utils/request';

export function addTask(data) {
  return request({
    url: '/tasks',
    method: 'post',
    data,
  });
}

export function fetchTaskList() {
  return request({
    url: '/tasks',
    method: 'get',
  });
}

export function fetchTask(_id) {
  return request({
    url: '/tasks/' + _id,
    method: 'get',
  });
}

export function updateTask(data, _id) {
  return request({
    url: '/tasks/' + _id,
    method: 'put',
    data,
  });
}

export function deleteTask(_id) {
  return request({
    url: '/tasks/' + _id,
    method: 'delete',
  });
}

export function fetchTaskResults(_id) {
  return request({
    url: '/tasks/' + _id + '/results',
    method: 'get',
  });
}

export function fetchTaskResult(_id, result_id) {
  return request({
    url: '/tasks/' + _id + '/results/' + result_id,
    method: 'get',
  });
}
