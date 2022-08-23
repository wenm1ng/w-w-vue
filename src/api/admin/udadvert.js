import request from '@/utils/request'
// ud广告计划列表
export function udadvertIndex(data) {
  return request({
    url: '/admin/udadvert/index',
    method: 'get',
    params: data
  })
}
// 添加
export function teamAdd(data) {
  return request({
      url: '/admin/team/addTeams',
      method: 'post',
      data:data
  })
}

// 编辑页面数据
export function udadvertEdit(data) {
  return request({
      url: '/admin/udadvert/getDetail',
      method: 'get',
      params:data
  })
}
// 编辑提交
export function udadvertUpdate(data) {
  return request({
      url: '/admin/udadvert/updateUdadvert',
      method: 'put',
      data:data
  })
}
// 广告计划列表
export function getCategoryList() {
  return request({
    url: '/admin/udadvert/getCategory',
    method: 'get'
  })
}

// ud广告计划列表
export function udadvertOncesIndex(data) {
  return request({
    url: '/admin/udadvert/onces-index',
    method: 'get',
    params: data
  })
}

// 头条详情数据
export function udadvertOncesDetails(data) {
  return request({
    url: '/admin/udadvert/get-onces-details',
    method: 'get',
    params:data
  })
}
// 编辑提交
export function udadvertOncesUpdate(data) {
  return request({
    url: '/admin/udadvert/update-onces-advert',
    method: 'put',
    data:data
  })
}
