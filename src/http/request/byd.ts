import axios from 'axios'

let baseURL = ''
if (import.meta.env.DEV) {
	// 测试环境需要代理
	baseURL = '/bydApis'
} else {
	baseURL = 'https://bydcloud.byd.com'
}
const service = axios.create({
	// `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
	// 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
	baseURL: baseURL,
	// `timeout` 指定请求超时的毫秒数。
	// 如果请求时间超过 `timeout` 的值，则请求会被中断
	timeout: 60000,
	// `withCredentials` 表示跨域请求时是否需要使用凭证
	withCredentials: true,
	// 自定义请求头
	headers: {
		// 设置后端需要的传参类型
		'Content-Type': 'application/json',
		'token': '',
		'X-Requested-With': 'XMLHttpRequest',
		'Access-Control-Allow-Origin': "*",
		// 'User-Agent': `Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x6307062c)`
	},
})

// 添加请求拦截器
service.interceptors.request.use(
	config => {
		// 在发送请求之前做什么
		return config
	},
	error => {
		// 对请求错误做些什么
		console.error("request use ", error)
		return Promise.reject(error)
	}
)

// 添加响应拦截器
service.interceptors.response.use(
	response => {
        // 2xx 范围内的状态码都会触发该函数。
		// console.log(response);
		const dataAxios = response.data
		return dataAxios
	},
	error => {		
        // 超出 2xx 范围的状态码都会触发该函数。
        // console.error("response use ", error)
        return Promise.reject(error)
	}
)

export default service