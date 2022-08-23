import request from '@/utils/request'

// 任务详情页-任务信息
export function taskInfo(data){
    return request({
        url: '/event/updateevent/show',
        method: 'post',
        params:data
    })
}

// 任务详情页-任务流转
export function taskAll(data){
    return request({
        url: '/event/updateevent/taskall',
        method: 'post',
        params:data
    })
}

