import axios from 'axios'

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://106.53.73.30:8888/api/private/v1',
    timeout: 5000
  })

  // 2.axios的拦截器
  // 2.1.请求拦截的作用://后端设置了权限，每一次请求都需要添加token，使用axios拦截器在数据发送请求前添加token
  // 2.2验证每一次请求是否都添加了token，在下面打印 console.log(config)，看看headers是否添加了
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
  }, err => {
    // console.log(err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}
