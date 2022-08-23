import request from '@/utils/request'
// 获取列表数据
export function Advertisementitem(data) {
  return request({
    url: '/admin/advert',
    method: 'get',
    params: data
  })
}
//查询接口
export function Advertisement(data) {
  return request({
    url: '/admin/advert',
    method: 'get',
    params: data
  })
}
//添加接口
export function Advertadd(data) {
  return request({
    url: '/admin/advert',
    method: 'post',
    params: data
  })
}
//修改接口
export function Advertment(data) {
  return request({
    url: `/admin/advert/${data?.id}`,
    method: 'put',
  })
}
//删除接口
export function Advertremove(data) {
  return request({
    url: `/admin/advert/${data?.id}`,
    method: 'delete',
  })
}
