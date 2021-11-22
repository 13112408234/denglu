import { request } from './request'

// 商品列表
export function ProductList(query, pagenum, pagesize) {
    return request({
        url: '/goods',
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}
// 添加商品
export function AddItemAxios() {
    return request({

    })
}
//删除商品
export function DeleteItemAxios(id) {
    return request({
        url: '/goods/' + id,
        method: 'delete'
    })
}