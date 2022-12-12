<template>
	<div id="container"> </div>
</template>

<script lang="ts" setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { shallowRef } from '@vue/reactivity'
import { onMounted } from 'vue';
let map = shallowRef<any>(null)

interface AmapProps {
	centerPos: Array<number>,
	positionArr?: Array<Array<number>>
}

const props = withDefaults(defineProps<AmapProps>(), {
	centerPos: () => [0, 0]
})

const initMap = () => {
	AMapLoader.load({
		key: '',  //设置您的key
		version: "2.0",
		plugins: ['AMap.ToolBar', 'AMap.Driving'],
		AMapUI: {
			version: "1.1",
			plugins: [],

		},
		Loca: {
			version: "2.0.0"
		},
	}).then((AMap) => {
		map = new AMap.Map("container", {
			viewMode: "3D",
			zoom: 18,
			zooms: [2, 22],
			// center: [115.73989, 28.62262],
			center: props.centerPos
		});
		// let positionArr = [
		// 	[115.73989, 28.62262],
		// ];

		let positionArr: Array<Array<number>> = props.positionArr || [];
		if (props.positionArr == null) {
			positionArr = [
				props.centerPos
			]
		}

		for (let item of positionArr) {
			let marker = new AMap.Marker({
				position: [item[0], item[1]],
			});
			map.add(marker);
		}

		// 同时引入工具条插件和比例尺插件
		AMap.plugin([
			'AMap.ToolBar',
			'AMap.Scale',
			'AMap.MapType',
			'AMap.Geolocation',
		], () => {
			// 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
			// map.addControl(new AMap.ToolBar());

			// 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
			map.addControl(new AMap.Scale());

			// 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
			map.addControl(new AMap.MapType());

			// 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
			map.addControl(new AMap.Geolocation());
		});

		const infoWindow = new AMap.InfoWindow({
			anchor: 'top-center',
			content: '车辆位置',
		});

		infoWindow.open(map, props.centerPos);
	}).catch(e => {
		console.error(e);
	})
}

onMounted(() => {
	// initMap()
	initMap()
})

</script>


<style  scoped lang="less">
#container {
	padding: 0px;
	margin: 0px;
	width: 100%;
	height: 800px;
}
</style>