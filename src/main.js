import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'




// css
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

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
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor, /* { default global options } */)

//全局的时间过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

import './assets/css/index.css'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
