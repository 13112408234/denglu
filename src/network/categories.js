import { request } from './request'

export function categoriesitem(type, pagenum, pagesize) {
    return request({
        url: '/categories',
        params: {
            type,
            pagenum,
            pagesize
        }
    })

}