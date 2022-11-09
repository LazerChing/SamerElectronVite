import axios from "../request/";

export function apiGetVehicleRealTimeResult() {
	return axios({
		url:'/wechat/Vehicle/vehicleRealTimeResult',
		method: 'post',
	})
}