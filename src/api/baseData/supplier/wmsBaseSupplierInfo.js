import request from '@/utils/request'
import {download } from '@/api/data'
import {downloadFile } from '@/utils/index'

export function add(data) {
  return request({
    url: 'api/wmsBaseSupplierInfo',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wmsBaseSupplierInfo/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wmsBaseSupplierInfo',
    method: 'put',
    data
  })
}

export function downloadTemp(data) {
 return download('api/wmsBaseSupplierInfo/templateDownload').then(result => {
    downloadFile(result,  '导入供应商模板', 'xlsx')
  }).catch(() => {
  })
}

export default { add, edit, del,downloadTemp }