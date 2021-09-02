import request from '@/utils/request';

export function fetchNetworkObjectMapData(_id) {
  return request({
    url: `/network_objects/${_id}/map_data`,
    method: 'get',
  });
}

export function fetchNetworkObjectProperties(_id) {
  return request({
    url: `/network_objects/${_id}/properties`,
    method: 'get',
  });
}

export function fetchNetworkDeviceConfig(_id) {
  return request({
    url: `/network_objects/${_id}/configuration`,
    method: 'get',
  });
}

export function fetchCloudWatchMetricData(data) {
  return request({
    url: '/cloudwatch',
    method: 'post',
    data,
  });
}

export function fetchZabbixHistoryData(data) {
  return request({
    url: '/zabbix',
    method: 'post',
    data,
  });
}
