import { request } from "./request";
// 商品分类
export function CommodityClassificationAxios() {
    return request({
        url: '/categories'
    })
}

// 参数列表

export function parameterListAxios(id, sel) {
    return request({
        url: 'categories/' + id + '/attributes',
        method: 'get',
        params: {
            sel,
        }
    })
}

//添加商

export function AddItemshopAxios(goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs) {
    return request({
        url: 'goods',
        method: 'post',
        data: {
            goods_name,
            goods_cat,
            goods_price,
            goods_number,
            goods_weight,
            goods_introduce,
            pics,
            attrs
        }
    })
}