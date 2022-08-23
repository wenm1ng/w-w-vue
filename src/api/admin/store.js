import request from '@/utils/request'
// 店铺列表
export function storeIndex(data) {
  return request({
    url: '/admin/store/index',
    method: 'get',
    params:data
  })
}
// 调整状态
export function storeStatus(data) {
  return request({
    url: '/admin/store/status',
    method: 'put',
    data:data
  })
}
// 添加管理员
export function storeStore(data) {
  return request({
    url: '/admin/store/store',
    method: 'post',
    data:data
  })
}

// 编辑页面数据
export function storeEdit(data) {
  return request({
    url: '/admin/store/edit',
    method: 'get',
    params:data
  })
}
// 编辑提交
export function storeUpdate(data) {
  return request({
    url: '/admin/store/update',
    method: 'put',
    data:data
  })
}

//删除店铺
export function storeDeletePwd(data) {
  return request({
    url: '/admin/store/destroy',
    method: 'delete',
    data: data
  })
}
