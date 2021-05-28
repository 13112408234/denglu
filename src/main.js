import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios'

//后端设置了权限，每一次请求都需要添加token，使用axios拦截器在数据发送请求前添加token
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem("token")
//   return config
// })

Vue.use(ElementUI);
Vue.config.productionTip = false

import './assets/css/index.css'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
