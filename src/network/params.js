import { request } from './request'

//参数列表
export function parameterList(id, sel) {
    return request({
        url: '/categories/' + id + '/attributes',
        method: 'get',
        params: {
            sel
        }
    })
}