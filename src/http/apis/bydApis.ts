import axios from "../request/";
import { CarData, RealTimeReqParams } from '@/types/BydTypes';

let requestedSerials: number[] = [];

function getRequestSerial() {
	let randNum = getRandNum(-999, 999)
	let loopCount = 0;
	while (requestedSerials.includes(randNum)) {
		randNum = getRandNum(-999, 999)
		loopCount++;
		if (loopCount > 10) {
			throw new Error("GetRequestSerial fail");
		}
	}
	requestedSerials.push(randNum)
}

function getRandNum(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRand32Str() {
	const strs = '1234567890abcdef'
	const randStr = (randNum: number) => {
		let result = ''
		while (randNum-- > 0) {
			result = strs[getRandNum(0, strs.length - 1)] + result;
		}
		return result;
	}
	return `${randStr(8)}-${randStr(4)}-${randStr(4)}-${randStr(4)}-${randStr(12)}`
}

export function apiGetCarInfo(cookie?: string): Promise<any> {
	const random = getRand32Str()
	const timeStamp = new Date().getTime()
	return new Promise((resolve, reject) => {
		axios({
			url: '/wechat/getuserinfo',
			method: 'get',
			params: {
				timeStamp,
				random
			},
			// data: JSON.stringify({ "caridentifier": carId, "autoType": autoType, "energyType": energyType, "requestSerial": requestSerial, "timeStamp": timeStamp, "random": random }),
		})
			.then((res: any) => {
				if (res?.rebackResult == 0) {
					resolve(res?.listInfo)
				} else {
					reject(res)
				}
			})
			.catch((err) => {
				reject(err)
			})
	})
}


export function apiVehicleRealTimeRequest(apiParams: RealTimeReqParams) {
	const { carId, autoType, energyType } = apiParams
	const requestSerial = getRequestSerial()
	const random = getRand32Str()
	const timeStamp = new Date().getTime()
	return new Promise((resolve, reject) => {
		axios({
			url: '/wechat/Vehicle/vehicleRealTimeRequest',
			method: 'post',
			data: JSON.stringify({ "caridentifier": carId, "autoType": autoType, "energyType": energyType, "requestSerial": requestSerial, "timeStamp": timeStamp, "random": random }),
		})
			.then((res: any) => {
				if (res?.rebackResult == 0) {
					resolve(res)
				} else {
					reject(res)
				}
			})
			.catch((err) => {
				reject(err)
			})
	})
}

export function apiGetVehicleRealTimeResult(apiParams: RealTimeReqParams) {
	const { carId, autoType, energyType } = apiParams
	const requestSerial = getRequestSerial()
	const random = getRand32Str()
	const timeStamp = new Date().getTime()

	return new Promise<CarData>((resolve, reject) => {
		axios({
			url: '/wechat/Vehicle/vehicleRealTimeResult',
			method: 'post',
			data: JSON.stringify({ "caridentifier": carId, "autoType": autoType, "energyType": energyType, "requestSerial": requestSerial, "timeStamp": timeStamp, "random": random }),
		})
			.then((res: any) => {
				if (res?.rebackResult == 0) {
					resolve(res.data)
				} else {
					reject(res)
				}
			})
			.catch((err) => {
				reject(err)
			})
	})
}