import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/importRecord/list',
        method: 'get',
        params
    })
}

export function reExecute(data) {
    return request({
      url: '/importRecord/reExecute',
      method: 'post',
      data
    })
  }