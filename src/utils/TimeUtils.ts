/**
 * 格式化时间戳
 * @param timestamp 秒
 * @return result  YYYY-MM-DD hh:mm:ss
 */
export function formatTimestamp(timestamp: number | string): string {
	let time = timestamp
	if (String(time).length == 10) {
		time = Number(time) * 1000;
	}
	var date = new Date(time);//时间戳为10位需*1000，时间戳为13位的话不需乘1000 
	var year = date.getFullYear(),
		month = ("0" + (date.getMonth() + 1)).slice(-2),
		sdate = ("0" + date.getDate()).slice(-2),
		hour = ("0" + date.getHours()).slice(-2),
		minute = ("0" + date.getMinutes()).slice(-2),
		second = ("0" + date.getSeconds()).slice(-2);
	// 拼接
	var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
	// 返回
	return result;
}
