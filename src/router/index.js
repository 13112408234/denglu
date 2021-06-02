import Vue from 'vue'
import VueRouter from 'vue-router'
const login = () => import('@/components/login')
const home = () => import('@/components/home')
const welcome = () => import('@/components/welcome')
const users = () => import('@/components/users')
const rights = () => import('@/components/power/rights')
const roles = () => import('@/components/power/roles')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },

  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: welcome,
      },
      {
        path: '/users',
        component: users,
      },
      {
        path: '/rights',
        component: rights,
      },
      {
        path: '/roles',
        component: roles,
      }
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//有登录才能访问到其他页面，没有登录访问其他页面跳转到首页
//使用导航守卫控制页面权限
router.beforeEach((to, from, next) => {
  //to代表将要访问的路径
  //from代表从哪一个路径跳转而来
  //next是一个函数，表示放行 2种用法：next() 代表放行   next('强制跳转的路径')
  if (to.path === '/login')
    return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //如果token为空，就是还没有登录，直接跳转到登录页面
  if (!tokenStr) return next('/login')

  return next();

})
export default router
