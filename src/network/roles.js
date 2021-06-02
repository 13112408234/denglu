import { request } from "./request";
export function rolesitemget() {
      return request({
          url:'roles'
      })
    
}

//删除角色指定权限的请求
export function  rolesremove (rold,right){
    return request({
        url:'/roles/'+rold+'/rights/'+right,
        method:'delete'
    })
}
//用户点击权限分配发起请求
export function  rolesitemquan(type) {
        return request({
            url:'/rights/'+type
        })
}

//点击权限确定修改请求
export function  rolesitemxiuquan(roleId,rids) {
    return request({
        url:'/roles/'+roleId+'/rights',
        method:'post',
        data:{
            rids
        }
       
    })
}