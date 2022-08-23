import request from '@/utils/request'

// 管理员列表
export function departmentIndex(data) {
  return request({
    url: '/admin/department/index',
    method: 'get',
    params: data
  })
}

// 添加
export function departmentStore(data) {
  return request({
    url: '/admin/department/store',
    method: 'post',
    data: data
  })
}

// 编辑页面数据
export function departmentEdit(data) {
  return request({
    url: '/admin/department/edit',
    method: 'get',
    params: data
  })
}

// 编辑提交
export function departmentUpdate(data) {
  return request({
    url: '/admin/department/update',
    method: 'put',
    data: data
  })
}

// 删除
export function departmentcDestroy(data) {
  return request({
    url: '/admin/department/del',
    method: 'delete',
    data: data
  })
}

// 下拉查询执行人-部门到人员
export function departmentUser(){
  return request({
    url: '/admin/department/departUser',
    method: 'get'
  })
}




