import request from '@/utils/request'
// 管理员列表
export function cateIndex(data) {
  return request({
    url: '/admin/category/index',
    method: 'get',
    params:data
  })
}
// 调整状态
export function cateStatus(data) {
    return request({
        url: '/admin/category/status',
        method: 'put',
        data:data
    })
}

// 添加
export function cateStore(data) {
  return request({
      url: '/admin/category/store',
      method: 'post',
      data:data
  })
}

// 编辑页面数据
export function cateEdit(data) {
  return request({
      url: '/admin/category/edit',
      method: 'get',
      params:data
  })
}
// 编辑提交
export function cateUpdate(data) {
  return request({
      url: '/admin/category/update',
      method: 'put',
      data:data
  })
}

// 编辑提交
export function catecDestroy(data) {
  return request({
      url: '/admin/category/del',
      method: 'delete',
      data:data
  })
}
