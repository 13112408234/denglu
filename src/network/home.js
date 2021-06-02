import { request } from "./request";

//登录请求
export function loginnet(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
//获取左侧菜单请求
export function getMenuList() {
  return request({
    url: "/menus"
  })
}

//用户管理》用户列表请求
export function getUserList(query, pagenum, pagesize) {
  return request({
    url: '/users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

//修改状态按钮
export function stateanniu(id, state) {
  return request({
    method: 'put',
    url: '/users/' + id + '/state/' + state
  })
}

//添加用户
export function addFormtijiao(username, password, email, mobile) {
  return request({
    url: '/users',
    method: 'post',
    data: {
      username,
      password,
      email,
      mobile
    }
  })
}

// 删除用户
export function addFormdelete(id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}

//修改用户
export function addFormput(id, email, mobile) {
  return request({
    method: 'put',
    url: '/users/' + id,
    data: {
      email,
      mobile
    }
  })
}

//角色分配请求
  export function addFormput_roles() {
    
    return request({
      url:'/roles'
    })

    }

//修改用户角色
export function addFormput_xiuroles(id,rid) {
    
  return request({
    url:'/users/'+id+'/role',
    method:'put',
    data:{
      rid
    }
  })
  }





// 函数调用 -> 压入函数栈(保存函数调用过程中所有变量)
// 函数调用结束 -> 弹出函数栈(释放函数所有的变量)
// function test() {
//   const names = ['why', 'aaa']
// }
//
// test()
//
// test()
// for (let n of nums1) {
//   totalNums.push(n)
// }

