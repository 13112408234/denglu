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

//添加动态参数或者静态属性
export function AddAttribute(id, attr_name, attr_sel, attr_vals) {
    return request({
        url: 'categories/' + id + '/attributes',
        method: 'post',
        data: {
            attr_name,
            attr_sel,
            attr_vals
        }
    })
}
//编辑参数
export function EditingParameters(id, attrId, attr_name, attr_sel, attr_vals) {
    return request({
        url: 'categories/' + id + '/attributes/' + attrId,
        method: 'put',
        data: {
            attr_name,
            attr_sel,
            attr_vals,
        }
    })
}

//删除动态参数或者静态属性
export function DeleteParameters(id, attrid) {
    return request({
        url: 'categories/' + id + '/attributes/' + attrid,
        method: 'delete',

    })
}
