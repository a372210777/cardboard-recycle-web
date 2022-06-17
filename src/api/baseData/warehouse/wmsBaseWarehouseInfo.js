import request from '@/utils/request'
import qs from 'qs'

export function add(data) {
  return request({
    url: 'api/wmsBaseWarehouseInfo',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wmsBaseWarehouseInfo/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wmsBaseWarehouseInfo',
    method: 'put',
    data
  })
}

export function getWarehouseList(data) {
  return request({
    url: 'api/wmsBaseWarehouseInfo?'+qs.stringify(data,{ indices: false }),
    method: 'get',
  })
}

export default { add, edit, del,getWarehouseList }
