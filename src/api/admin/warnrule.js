import request from '@/utils/request'
// 规则列表
export function rulesIndex(data) {
  return request({
    url: '/admin/monitor/rules',
    method: 'get',
    params:data
  })
}
// 调整状态
export function rulesStatus(data) {
  return request({
    url: '/admin/monitor/rulesstatus',
    method: 'put',
    data:data
  })
}
// 规则添加
export function rulesAdd(data) {
  return request({
    url: '/admin/monitor/rulesadd',
    method: 'post',
    data:data
  })
}

// 规则修改
export function rulesEdit(data) {
  return request({
    url: '/admin/monitor/rulesedit',
    method: 'get',
    params:data
  })
}
// 规则更新提交
export function rulesUpdate(data) {
  return request({
    url: '/admin/monitor/rulesupdate',
    method: 'put',
    data:data
  })
}

//删除规则
export function rulesDelete(data) {
  return request({
    url: '/admin/monitor/rulesdestroy',
    method: 'delete',
    data: data
  })
}

// 开关单独修改
export function rulesSwitch(data){
  return request({
    url: '/admin/monitor/ruleswitch',
    method: 'put',
    params: data
  })
}
