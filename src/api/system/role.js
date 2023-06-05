import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params
  })
}

export function del(data) {
  return request({
    url: '/role/del',
    method: 'post',
    data
  })
}

export function getInfo(params) {
  return request({
    url: '/role/getInfo',
    method: 'get',
    params
  })
}

export function edit(data) {
  return request({
    url: '/role/edit',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/role/changeStatus',
    method: 'post',
    data
  })
}

export function batchDel(data) {
  return request({
    url: '/role/batchDel',
    method: 'post',
    data
  })
}

export function getRoleNameList(params) {
  return request({
    url: '/role/getRoleNameList',
    method: 'get',
    params
  })
}

export function getGrantAuth(params) {
  return request({
    url: '/role/getGrantAuth',
    method: 'get',
    params
  })
}

export function grantAuth(data) {
  return request({
    url: '/role/grantAuth',
    method: 'post',
    data
  })
}

