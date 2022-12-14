import request from '@/utils/request'

// 获取wa列表数据
export function getWaList(data) {
  return request({
    url: '/admin/wa/list',
    method: 'get',
    params: data
  })
}
//查询接口
export function getWaInfo(data) {
  return request({
    url: '/admin/wa/info',
    method: 'get',
    params: data
  })
}
//版本列表
export function getVersionList() {
  return request({
    url: '/admin/wa/version/list',
    method: 'get',
  })
}
//职业列表
export function getOcList() {
  return request({
    url: '/admin/wa/oc/list',
    method: 'get',
  })
}
//tab列表
export function getTabList() {
  return request({
    url: '/admin/wa/tab/list',
    method: 'get',
  })
}
//新增wa
export function addWa(data) {
  return request({
    url: '/admin/wa/add',
    method: 'post',
    data:data
  })
}
//修改wa
export function updateWa(data) {
  return request({
    url: '/admin/wa/update',
    method: 'post',
    data:data
  })
}
//修改wa状态
export function waStatus(data) {
  return request({
    url: '/admin/wa/status',
    method: 'post',
    data:data
  })
}
//获取评论列表
export function getCommentList(data) {
  return request({
    url: '/admin/wa/comment/list',
    method: 'get',
    params:data
  })
}
//修改评论状态
export function commentStatus(data) {
  return request({
    url: '/admin/wa/comment/status',
    method: 'post',
    data:data
  })
}
//删除评论
export function commentDel(data) {
  return request({
    url: '/admin/wa/comment/del',
    method: 'post',
    data:data
  })
}

//排行榜列表
export function getRankList(data) {
  return request({
    url: '/admin/wa/rank/list',
    method: 'post',
    data:data
  })
}

//回答列表
export function getAnswerList(data) {
  return request({
    url: '/admin/wa/answer/list',
    method: 'get',
    params:data
  })
}

//删除回答
export function answerDelete(data) {
  return request({
    url: '/admin/wa/answer/delete',
    method: 'post',
    data:data
  })
}

//修改回答状态
export function answerStatus(data) {
  return request({
    url: '/admin/wa/answer/status',
    method: 'post',
    data:data
  })
}
