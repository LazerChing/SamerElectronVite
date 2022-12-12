// 定义store
import { apiGetCarInfo, apiGetVehicleRealTimeResult, apiVehicleRealTimeRequest, apiGetVehicleLocation } from "@/http/apis/bydApis";
import { RealTimeReqParams, CarData, CarInfo, CarLocationData } from "@/types/BydTypes";
import { awaitWrapper } from "@/utils/functions";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { ref } from "vue";

const MAP_RATIO = 0.000001

//#region setup式API
// export const useBydInfoStore = defineStore('bydInfo', () => {
// 	// 当前cookies
// 	const cookie = ref('')
// 	// 车辆信息
// 	const carInfo = ref<CarInfo | null>(null)
// 	// 车辆状态数据
// 	const carData = ref<CarData | null>(null)

// })
//#endregion

//#region 选项式API
export const useBydInfoStore = defineStore('bydInfo', {
	state: () => {
		return {
			// 当前cookis
			cookie: '',
			carInfo: null as CarInfo[] | null,
			carData: null as CarData | null,
			carLocationData: null as CarLocationData | null, // 经纬度需要乘以0.000001
		}
	},
	getters: {
		// 非箭头函数，可以使用 this，但是需要注明返回类型
		zlcText(): string {
			return this.carData?.zlc ? `${this.carData?.zlc}km` : '暂无数据'
		},

		// 箭头函数，不可以使用this，需指定state，不用指定返回类型，可以自动推断
		longitude_latitude: (state) => {
			if (state.carLocationData) {
				const longitude = Number((state.carLocationData.longitude * MAP_RATIO).toFixed(6))
				const latitude = Number((state.carLocationData.latitude * MAP_RATIO).toFixed(6))
				return `${longitude},${latitude}`
			}
			return '暂无位置信息'
		},
		locationPosArr: (state) => {
			if (state.carLocationData) {
				return [Number((state.carLocationData.longitude * MAP_RATIO).toFixed(6)), Number((state.carLocationData.latitude * MAP_RATIO).toFixed(6))]
			}
			return [0, 0]
		}

	},
	actions: {
		// 获取车辆信息
		async getCarInfo(cookie: string,) {
			this.cookie = document.cookie = cookie

			const [err, carInfo] = await awaitWrapper(apiGetCarInfo())
			if (err) {
				ElMessage.error('获取车辆信息失败:' + err?.rebackDesc)
				console.warn(err);
				return null
			}
			else {
				carInfo && (this.carInfo = carInfo)
				return carInfo
			}
		},

		async getCarData() {
			if (!this.carInfo || this.carInfo[0] == null) {
				ElMessage.error('请先获取车辆信息')
				return null
			}
			try {
				const apiParams: RealTimeReqParams = {
					carId: this.carInfo[0].vin,
					autoType: this.carInfo[0].autoType,
					energyType: this.carInfo[0].energyType
				}
				const reqRes = await apiVehicleRealTimeRequest(apiParams)
				const result = await apiGetVehicleRealTimeResult(apiParams)
				result && (this.carData = result)
				return result;
			} catch (error: any) {
				ElMessage.error('获取车辆数据失败:' + error?.rebackDesc)
				console.warn(error);

				return null;
			}
		},

		async getCarLocation() {
			if (!this.carInfo || this.carInfo[0] == null) {
				ElMessage.error('请先获取车辆信息')
				return null
			}
			const [err, res] = await awaitWrapper(apiGetVehicleLocation(this.carInfo[0].vin))
			if (err) {
				ElMessage.error('获取车辆位置数据失败:' + err?.rebackDesc)
				console.warn(err);
				return null
			} else {
				res && (this.carLocationData = res)
				return res;
			}
		},

		xhText() {
			if (this.carData?.xh) return this.carData?.xh + 'km'
			return '暂无数据'
		},
	}
});
//#endregion