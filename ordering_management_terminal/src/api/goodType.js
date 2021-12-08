import axios from '@/libs/api.request'

// 商品列表
export const goodTypePage = info => {
  return axios.request({
    url: 'foodType/page',
    data: info,
    method: 'post'
  })
}
// 商品修改
export const goodTypeUpdate = info => {
  return axios.request({
    url: 'foodType/update',
    data: info,
    method: 'post'
  })
}
// 商品添加
export const goodTypeAdd = info => {
  return axios.request({
    url: 'foodType/add',
    data: info,
    method: 'post'
  })
}
// 商品删除
export const goodTypeDel = info => {
  return axios.request({
    url: 'foodType/del',
    data: info,
    method: 'post'
  })
}

