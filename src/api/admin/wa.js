import request from '@/utils/request'

// 获取wa列表数据
export function getWaList(data) {
  return request({
    url: '/admin/wa/list',
    method: 'get',
    params: data
  })
}
//查询接口
export function getWaInfo(data) {
  return request({
    url: '/admin/wa/info',
    method: 'get',
    params: data
  })
}
