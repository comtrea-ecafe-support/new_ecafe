import axios from '@/libs/api.request'

// 列表
export const orderPage = info => {
  return axios.request({
    url: 'payment/page',
    data: info,
    method: 'post'
  })
}
export const orderExport = info => {
  return axios.request({
    url: 'payment/export',
    data: info,
    method: 'post'
  })
}
// 删除
export const orderDel = info => {
  return axios.request({
    url: 'payment/del',
    data: info,
    method: 'post'
  })
}
// 添加
export const orderAdd = info => {
  return axios.request({
    url: 'payment/add',
    data: info,
    method: 'post'
  })
}
// 修改
export const orderUpdate = info => {
  return axios.request({
    url: 'payment/update',
    data: info,
    method: 'post'
  })
}
// 权限列表（用于分配权限列表）
export const orderList = info => {
  return axios.request({
    url: 'payment/list',
    data: info,
    method: 'post'
  })
}
// 用户权限列表
export const getMenusList = info => {
  return axios.request({
    url: 'payment/menus',
    data: info,
    method: 'post'
  })
}
