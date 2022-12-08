// 定义store
import { apiGetCarInfo, apiGetVehicleRealTimeResult, apiVehicleRealTimeRequest } from "@/http/apis/bydApis";
import { RealTimeReqParams, CarData, CarInfo } from "@/types/BydTypes";
import { awaitWrapper } from "@/utils/functions";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { ref } from "vue";

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
		}
	},
	getters: {
		// 箭头函数，不可以使用this，需指定state，不用指定返回类型，可以自动推断
		// xhText: (state) => {
		// 	if (state.carData?.xh) return state.carData?.xh + 'km'
		// 	return '暂无数据'
		// },

		// 非箭头函数，可以使用 this，但是需要注明返回类型
		zlcText(): string {
			return this.carData?.zlc ? `${this.carData?.zlc}km` : '暂无数据'
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

		xhText() {
			if (this.carData?.xh) return this.carData?.xh + 'km'
			return '暂无数据'
		},
	}
});
//#endregion