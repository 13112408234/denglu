import {request} from './request'
export function rightsqxlb(type) {
    return request({
        url: '/rights/' + type
    })
}