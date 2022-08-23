import request from '@/utils/request'
// 计划监控 数据展示列表
export function monitorindex(data) {
  return request({
    url: '/admin/monitor/index',
    method: 'get',
    params:data
  })
}

// 账号下拉框数据
export function accountSelect() {
  return request({
    url: '/admin/monitor/dropdown',
    method: 'post',
  })
}

// 计划组下拉框数据
export function planGroupsSelect() {
  return request({
    url: '/admin/monitor/dropdownplangroup',
    method: 'post',
  })
}

// 计划名称 下拉框数据
export function planNameSelect() {
  return request({
    url: '/admin/monitor/dropdownplan',
    method: 'post',
  })
}


// 平台名称 下拉框数据
export function platNameSelect() {
  return request({
    url: '/admin/monitor/platlist',
    method: 'post',
  })
}