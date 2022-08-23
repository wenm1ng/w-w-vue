import request from '@/utils/request'
// 数据汇总报表
// 顶部搜索返回数据内容
export function searchInput(data){
    return request({
        url: '/admin/report/plan/drop-down',
        method: 'get',
        params: data
    })
}

// 顶部详细数据
export function accountList(data){
    return request({
        url: '/admin/report/account/summary',
        method: 'get',
        params: data
    })
}

// 底部分页列表数据
// 计划tabs 列表分页
export function planList(data){
    return request({
        url: '/admin/report/plan/list',
        method: 'post',
        params: data
    })
}

// 以下2个接口沿用-用户汇总报表页面接口
// 设置预警值后提交
export function warningList(data){
    return request({
        url: '/bigdata/report/alertsetting',
        method: 'post',
        params: data
    })
}

// 预警值展示
export function setWarningVal(){
    return request({
        url:'/bigdata/report/settinglist',
        method: 'post'
    })
}