import request from '@/utils/request'
// 广告投放-创建
export function createAd(data){
  return request({
    url: '/admin/advert',
    method: 'post',
    data: data
  })
}

// 广告投放-列表详情-编辑页面数据
export function adInfo(data){
  return request({
    url: '/admin/advert',
    method: 'get',
    params: data
  })
}

// 广告投放-列表详情-编辑提交-更新
export function adItemUpdate(data) {
  return request({
    url: '/admin/advert',
    method: 'put',
    data:data
  })
}


// 广告投放-列表-分页
export function adList(data){
  return request({
    url: '/admin/advert',
    method: 'get',
    params: data
  })
}


// 调整状态
// export function productStatus(data) {
//   return request({
//     url: '/admin/product/status',
//     method: 'put',
//     data:data
//   })
// }


// 广告投放-删除
export function deleteItem(data) {
  return request({
      url: '/admin/operationLog/cDestroy',
      method: 'delete',
      data:data
  })
}

// 广告投放-批量删除
// export function deleteAll(data) {
//   return request({
//       url: '/admin/operationLog/cDestroyAll',
//       method: 'delete',
//       data:data
//   })
// }
