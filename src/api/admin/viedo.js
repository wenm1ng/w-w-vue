import request from '@/utils/request'

// -----素材标签管理【暂时不改她的api方法名】
// 获取列表数据
export function viedotitem(data) {
  return request({
    url: '/admin/tag/index',
    method: 'get',
    params: data
  })
}
//查询接口
export function viedosement(data) {
  return request({
    url: '/admin/tag/index',
    method: 'get',
    params: data
  })
}
//添加接口
export function viedoadd(data) {
  return request({
    url: '/admin/tag/store',
    method: 'post',
    params: data
  })
}
//打开编辑按钮对话框
export function viedoedit(data) {
  return request({
    url: '/admin/tag/edit',
    method: 'get',
    params: data
  })
}
//编辑接口
export function viedoreupdate(data) {
  return request({
    url: '/admin/tag/update',
    method: 'put',
    params: data
  })
}
//删除接口
export function viedoemove(data) {

  return request({
    url: '/admin/tag/del',
    method: 'delete',
    params: data
  })
}

// 标签列表下拉
export function searchMaterial(data) {
  return request({
    url: '/admin/tag/index',
    method: 'get',
    params: data
  })
}

// -----素材信息管理页面
// 获取素材列表
export function materialList(data) {
  return request({
    url: '/admin/material/list',
    method: 'post',
    data: data
  })
}
//添加素材
export function materiaAdd(data) {
  return request({
    url: '/admin/material/add',
    method: 'post',
    data: data
  })
}
//获取素材信息
export function materialInfo(data) {
  return request({
    url: '/admin/material/info',
    method: 'get',
    data: data
  })
}
//编辑素材
export function materialUpdate(data) {
  return request({
    url: '/admin/material/update',
    method: 'post',
    data: data
  })
}
//删除素材
export function materialDelete(data) {
  return request({
    url: '/admin/material/delete',
    method: 'post',
    params: data
  })
}

// 删除上传的素材资源
export function deleteFileUrl(data){
  return request({
    url: '/admin/material/delete-file',
    method: 'post',
    params: data
  })
}


// 批量添加/删除素材标签-素材库2.0接口（批量+-都用同一个接口）
export function multipleTagAction(data){
  return request({
    url: '/admin/material/update-tags',
    method: 'post',
    data: data
  })
}

// 批量下载素材资源-统计下载次数
export function multipleTagDownload(data){
  return request({
    url: '/admin/material/add-download-num',
    method: 'post',
    data: data
  })
}