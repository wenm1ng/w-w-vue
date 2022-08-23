import request from '@/utils/request'

// 管理员列表
export function brandIndex(data) {
  return request({
    url: '/admin/brand/index',
    method: 'get',
    params: data
  })
}

// 调整状态
export function brandStatus(data) {
  return request({
    url: '/admin/brand/status',
    method: 'put',
    data: data
  })
}

// 添加
export function brandStore(data) {
  return request({
    url: '/admin/brand/store',
    method: 'post',
    data: data
  })
}

// 编辑页面数据
export function brandEdit(data) {
  return request({
    url: '/admin/brand/edit',
    method: 'get',
    params: data
  })
}

// 编辑提交
export function brandUpdate(data) {
  return request({
    url: '/admin/brand/update',
    method: 'put',
    data: data
  })
}

// 编辑提交
export function brandcDestroy(data) {
  return request({
    url: '/admin/brand/del',
    method: 'delete',
    data: data
  })
}

// 获取分类
export function getcate(data) {
  return request({
    url: '/admin/brand/getcate',
    method: 'get',
    params: data
  })
}



