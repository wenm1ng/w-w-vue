import request from '@/utils/request'
// 列表
export function dashboardIndex() {
  return request({
    url: '/bigdata/dashboard/index',
    method: 'get'
  })
}
