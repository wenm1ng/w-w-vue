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
//版本列表
export function getVersionList() {
  return request({
    url: '/admin/wa/version/list',
    method: 'get',
  })
}
//职业列表
export function getOcList() {
  return request({
    url: '/admin/wa/oc/list',
    method: 'get',
  })
}
//tab列表
export function getTabList() {
  return request({
    url: '/admin/wa/tab/list',
    method: 'get',
  })
}
//新增wa
export function addWa(data) {
  return request({
    url: '/admin/wa/add',
    method: 'post',
    data:data
  })
}
//修改wa
export function updateWa(data) {
  return request({
    url: '/admin/wa/update',
    method: 'post',
    data:data
  })
}
//修改wa状态
export function waStatus(data) {
  return request({
    url: '/admin/wa/status',
    method: 'post',
    data:data
  })
}
