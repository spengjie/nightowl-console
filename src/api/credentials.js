import request from '@/utils/request';

export function addCliCredential(data) {
  return request({
    url: '/credentials/cli',
    method: 'post',
    data,
  });
}

export function fetchCliCredentials(data) {
  return request({
    url: '/credentials/cli',
    method: 'get',
  });
}

export function fetchCliCredential(_id) {
  return request({
    url: '/credentials/cli/' + _id,
    method: 'get',
  });
}

export function updateCliCredential(data, _id) {
  return request({
    url: '/credentials/cli/' + _id,
    method: 'put',
    data,
  });
}

export function deleteCliCredential(_id) {
  return request({
    url: '/credentials/cli/' + _id,
    method: 'delete',
  });
}

export function addAwsAccessKey(data) {
  return request({
    url: '/credentials/aws_access_keys',
    method: 'post',
    data,
  });
}

export function fetchAwsAccessKeys(data) {
  return request({
    url: '/credentials/aws_access_keys',
    method: 'get',
  });
}

export function fetchAwsAccessKey(_id) {
  return request({
    url: '/credentials/aws_access_keys/' + _id,
    method: 'get',
  });
}

export function updateAwsAccessKey(data, _id) {
  return request({
    url: '/credentials/aws_access_keys/' + _id,
    method: 'put',
    data,
  });
}

export function deleteAwsAccessKey(_id) {
  return request({
    url: '/credentials/aws_access_keys/' + _id,
    method: 'delete',
  });
}

export function fetchCredentialsByType(type) {
  const typeMapping = {
    'AWSAccessSKey': 'aws_access_keys',
    'CLICredential': 'cli',
  };
  return request({
    url: `/credentials/${typeMapping[type]}`,
    method: 'get',
  });
}
