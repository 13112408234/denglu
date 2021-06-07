import Vue from 'vue'
import VueRouter from 'vue-router'
const login = () => import('@/views/login')
const home = () => import('@/views/home')
const welcome = () => import('@/views/user/welcome')
const users = () => import('@/views/user/users')
const rights = () => import('@/views/power/rights')
const roles = () => import('@/views/power/roles')
const goods = () => import('@/views/goods/goods')
const params = () => import('@/views/goods/params')
const categories = () => import('@/views/goods/categories')
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
      },
      {
        path: '/goods',
        component: goods,
      },
      {
        path: '/params',
        component: params,
      },
      {
        path: '/categories',
        component: categories,
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
