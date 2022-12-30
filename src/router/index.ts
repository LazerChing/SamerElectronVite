
import { createRouter, createWebHistory } from "vue-router";
import AboutView from '../views/AboutView.vue'
import HandleMusicView from '../views/HandleMusicView.vue'
import VehicleDataView from '../views/VehicleDataView.vue'
import HelloWorld from "../components/HelloWorld.vue";
const routes  = [
	{
		path: '/',
		redirect: '/vehicleData',
		name:"home",
		// component: HelloWorld,
		// props: { msg: 'Home'}
	},
	{
		path: '/about',
		// name:"AboutView",
		component: AboutView
	},
	{
		path: '/helloWorld/:msg',
		name:"helloWorld",
		component: HelloWorld,
		props: true
	},
	{
		path: '/handleMusic',
		name: 'handleMusic',
		component: HandleMusicView,
	},
	{
		path: '/vehicleData',
		name: 'vehicleData',
		component: VehicleDataView,
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router