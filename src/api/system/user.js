import request from '@/utils/request'

export function infoByToken(token) {
  return request({
    url: '/infoByToken',
    method: 'get',
    params: { token }
  })
}

export function getList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

export function del(data) {
  return request({
    url: '/user/del',
    method: 'post',
    data
  })
}

export function getInfo(params) {
  return request({
    url: '/user/getInfo',
    method: 'get',
    params
  })
}

export function edit(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/user/changeStatus',
    method: 'post',
    data
  })
}

export function batchDel(data) {
  return request({
    url: '/user/batchDel',
    method: 'post',
    data
  })
}

export function exportUser(data) {
  return request({
    url: '/user/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function downloadTemplate(data) {
  return request({
    url: '/user/downloadTemplate',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function Import(data) {
  return request({
    url: '/user/Import',
    method: 'post',
    data
  })
}

export function grantRole(data) {
  return request({
    url: '/user/grantRole',
    method: 'post',
    data
  })
}

export function getGrantRole(params) {
  return request({
    url: '/user/getGrantRole',
    method: 'get',
    params
  })
}

export function getUserNameList(params) {
  return request({
    url: '/user/getUserNameList',
    method: 'get',
    params
  })
}
