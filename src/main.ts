import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
// import './samples/node-api'
import router from './router'

import axios from 'axios'
const app = createApp(App)

import { createPinia, PiniaPluginContext } from 'pinia'
const pinia = createPinia()

type Options = {
	key?: string
}
const piniaPlugin = (options: Options) => {
	return (context: PiniaPluginContext) => {
		const { store } = context;

		// 解决pinia在setup语法下中使用$reset()报错的问题
		const initialState = JSON.parse(JSON.stringify(store.$state))
		store.$reset = () => {
			store.$state = JSON.parse(JSON.stringify(initialState));
		}
	}
}

//注册pinia 插件
pinia.use(piniaPlugin({
	key: "pinia"
}))

// 全局注册所有ElementPlus icon图标
Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
	app.component(key, component)
})

app
.use(ElementPlus)
.use(router)
.use(pinia)
.mount('#app')
.$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})

// 方式1，挂载到全局属性
app.config.globalProperties.$http = axios

// 方式2，provide 出去，后面要使用的地方通过inject接收
app.provide('$axios', axios)

console.log("Env", import.meta.env)
console.log("VITE_ENV", import.meta.env.VITE_ENV)
