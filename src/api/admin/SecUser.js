import request from '@/utils/request'

// 管理员列表
export function SecUserIndex(data) {
  return request({
    url: '/admin/secuser/index',
    method: 'get',
    params: data
  })
}

// 调整状态
export function SecUserStatus(data) {
  return request({
    url: '/admin/secuser/status',
    method: 'put',
    data: data
  })
}

// 添加
export function SecUserStore(data) {
  return request({
    url: '/admin/secuser/store',
    method: 'post',
    data: data
  })
}

// 编辑页面数据
export function SecUserEdit(data) {
  return request({
    url: '/admin/secuser/edit',
    method: 'get',
    params: data
  })
}

// 编辑提交
export function SecUserUpdate(data) {
  return request({
    url: '/admin/secuser/update',
    method: 'put',
    data: data
  })
}

// 编辑提交
export function SecUsercDestroy(data) {
  return request({
    url: '/admin/secuser/del',
    method: 'delete',
    data: data
  })
}

// 湖片区平台列表
export function GegPlatform(data) {
  return request({
    url: '/admin/platform/list',
    method: 'get',
    params: data
  })
}

