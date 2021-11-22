import { request } from "./request";

//订单列表
export function OrderListAxios(query, pagenum, pagesize) {
    return request({
        url: 'orders',
        method: 'get',
        params: {
            query,
            pagenum,
            pagesize
        },
    })

}
