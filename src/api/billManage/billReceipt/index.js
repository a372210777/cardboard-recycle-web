import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/statement',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/statement/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/statement',
    method: 'put',
    data
  })
}

export function staticsByMonth(params) {
  return request({
    url: '/api/statement/add',
    method: 'get',
    params
  })
}




export default { add, edit, del,staticsByMonth }
