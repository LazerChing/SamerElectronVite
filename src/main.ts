import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
// import './samples/node-api'
import router from './router'

import axios from 'axios'
const app = createApp(App)

import { createPinia } from 'pinia'
const store = createPinia()

app
.use(ElementPlus)
.use(router)
.use(store)
.mount('#app')
.$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})

// 方式1，挂载到全局属性
app.config.globalProperties.$http = axios

// 方式2，provide 出去，后面要使用的地方通过inject接收
app.provide('$axios', axios)
