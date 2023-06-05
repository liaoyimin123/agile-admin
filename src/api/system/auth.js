import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/auth/list',
    method: 'get',
    params
  })
}

export function getAuthList(params) {
  return request({
    url: '/auth/list',
    method: 'get',
    params
  })
}

export function del(data) {
  return request({
    url: '/auth/del',
    method: 'post',
    data
  })
}

export function getInfo(params) {
  return request({
    url: '/auth/getInfo',
    method: 'get',
    params
  })
}

export function getAuthNameList(params) {
    return request({
      url: '/auth/getAuthNameList',
      method: 'get',
      params
    })
  }

export function edit(data) {
  return request({
    url: '/auth/edit',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/auth/add',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/auth/changeStatus',
    method: 'post',
    data
  })
}

export function batchDel(data) {
  return request({
    url: '/auth/batchDel',
    method: 'post',
    data
  })
}

