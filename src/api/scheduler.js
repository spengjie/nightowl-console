import request from '@/utils/request';

export function fetchSchedulerJobs() {
  return request({
    url: '/scheduler/jobs',
    method: 'get',
  });
}
