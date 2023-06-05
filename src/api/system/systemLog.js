import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/systemLog/list',
        method: 'get',
        params
    })
}