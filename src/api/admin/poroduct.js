import request from '@/utils/request'
// 管理员列表
export function productList(data) {
  return request({
    url: '/admin/product/list',
    method: 'get',
    params:data
  })
}
// 调整状态
export function productStatus(data) {
  return request({
    url: '/admin/product/status',
    method: 'put',
    data:data
  })
}
// 添加商品
export function productAdd(data) {
  return request({
    url: '/admin/product/add',
    method: 'post',
    data:data
  })
}

// 编辑页面数据
export function productInfo(data) {
  return request({
    url: '/admin/product/info',
    method: 'get',
    params:data
  })
}
// 编辑提交
export function productUpdate(data) {
  return request({
    url: '/admin/product/update',
    method: 'put',
    data:data
  })
}
// 初始化密码
export function productDelete(data) {
  return request({
    url: '/admin/product/delete',
    method: 'put',
    data:data
  })
}

