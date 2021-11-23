import axios from 'axios'
//导入NProgress包对应的js和css，进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1',
    timeout: 50000
  })

  // 2.axios的拦截器
  // 2.1.请求拦截的作用://后端设置了权限，每一次请求都需要添加token，使用axios拦截器在数据发送请求前添加token
  // 2.2验证每一次请求是否都添加了token，在下面打印 console.log(config)，看看headers是否添加了
  instance.interceptors.request.use(config => {

    config.headers.Authorization = window.sessionStorage.getItem("token")
    // 在request中展示进度条NProgress.start()
    NProgress.start()
    return config
  }, err => {
    // console.log(err);
  })

  // 2.2.response响应拦截中，隐藏进度条NProgress.done() 
  instance.interceptors.response.use(res => {
    NProgress.done()  //隐藏进度条
    return res.data
  }, err => {
    console.log(err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}
