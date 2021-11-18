import { request } from './request'
//分类列表请求
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
//添加分类
export function addCategory(cat_pid, cat_name, cat_level) {
    return request({
        method: 'post',
        url: '/categories',
        data: {
            cat_pid,
            cat_name,
            cat_level
        }
    })
}

// 删除分类
export function DeleteClassificatio(id) {
    return request({
        url: '/categories/' + id,
        method: 'delete'
    })
}

//编辑分类请求
export function EditClassificationRequest(id, cat_name) {
    return request({
        url: '/categories/' + id,
        method: 'put',
        data: {
            cat_name
        }
    })
}
