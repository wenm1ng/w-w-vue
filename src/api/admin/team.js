import request from '@/utils/request'
// 团队管理列表
export function teamIndex(data) {
  return request({
    url: '/admin/team/index',
    method: 'get',
    params: data
  })
}
// 添加
export function teamAdd(data) {
  return request({
      url: '/admin/team/addTeams',
      method: 'post',
      data:data
  })
}

// 编辑页面数据
export function teamEdit(data) {
  return request({
      url: '/admin/team/detail',
      method: 'get',
      params:data
  })
}
// 编辑提交
export function teamUpdate(data) {
  return request({
      url: '/admin/team/updateTeam',
      method: 'put',
      data:data
  })
}
// 删除
export function del(data) {
  return request({
      url: '/admin/team/delTeam',
      method: 'delete',
      data:data
  })
}


