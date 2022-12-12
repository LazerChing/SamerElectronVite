export interface CarData {
	zdl: number;
	zyl: number;
	time: number;
	cmzq: number;
	cmyq: number;
	cmzh: number;
	cmyh: number;
	hbx: number;
	forwardCanopy: number;
	cczq: number;
	cczh: number;
	ccyq: number;
	ccyh: number;
	tianc: number;
	dydw: number;
	zczt: number;
	xh: number;
	oilXh: number;
	evXh: number;
	nh: string;
	ljnh: string;
	ljnhEn: string;
	gl: number;
	zlc: number;
	soc: number;
	soo: number;
	ok: number;
	ltylzq: number;
	ltylyq: number;
	ltylzh: number;
	ltylyh: number;
	ltylzzq: number;
	ltylzyq: number;
	ltylzzh: number;
	ltylzyh: number;
	cdzt: number;
	cdxs: number;
	cdfz: number;
	speed: number;
	fdjgz: number;
	zczdxt: number;
	dzzcxt: number;
	abs: number;
	srs: number;
	ltkslq: number;
	tyxt: number;
	esp: number;
	eps: number;
	zxxt: number;
	svs: number;
	ins: number;
	lqywd: number;
	lqwdz: number;
	jyyl: number;
	cdxt: number;
	dldc: number;
	dlxt: number;
	dlms: number;
	dldccdlj: number;
}

export interface CarInfo {
	autoPlate: string;
	imsiMD5: string;
	autoType: string;
	vin: string;
	isbindvin: number;
	vehicleState: number;
	energyType: number;
	dcm: number;
	grpName: string;
	autoStyleName: string;
	autoDisplaceMent: string;
	readStatus: number;
}

export interface RealTimeReqParams {
	// 车架号
	carId: string,
	// 车型
	autoType: string,
	// 能源类型
	energyType: number
}

// 车辆位置信息
export interface CarLocationData {
	longitude: number;
	latitude: number;
}