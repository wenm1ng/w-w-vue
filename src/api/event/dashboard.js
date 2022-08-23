import request from '@/utils/request'
// 列表
export function dashboardIndex() {
  return request({
    url: '/event/dashboard/index',
    method: 'get'
  })
}
