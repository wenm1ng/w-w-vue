import request from '@/utils/request'
// 管理员列表
export function platformList(data) {
  return request({
    url: '/admin/platform/list',
    method: 'get',
    params:data
  })
}
// 调整状态
export function platformStatus(data) {
  return request({
    url: '/admin/platform/status',
    method: 'post',
    data:data
  })
}
// 添加商品
export function platformAdd(data) {
  return request({
    url: '/admin/platform/add',
    method: 'post',
    data:data
  })
}

// 编辑页面数据
export function platformInfo(data) {
  return request({
    url: '/admin/platform/info',
    method: 'get',
    params:data
  })
}
// 编辑提交
export function platformUpdate(data) {
  return request({
    url: '/admin/platform/update',
    method: 'post',
    data:data
  })
}
// 初始化密码
export function platformDelete(data) {
  return request({
    url: '/admin/platform/delete',
    method: 'post',
    data:data
  })
}

