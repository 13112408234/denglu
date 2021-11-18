import { request } from './request'

//级联选择器的商品列表
export function ProductList(type, pagenum, pagesize) {
    return request({
        url: '/categories',
        method: 'get',
        data: {
            type,
            pagenum,
            pagesize
        }
    })
}