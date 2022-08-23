import request from '@/utils/request'
// 统计列表
export function statisticsList(data) {
    return request({
        url: '/admin/stat/list',
        method: 'get',
        params: data
    })
}
//团队列表
export function TeamList(data) {
    return request({
        url: '/admin/team/list',
        method: 'get',
        params: data
    })
}