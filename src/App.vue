<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const onGotoHomeClick = () => {  
  router.push({
    name: 'home'
  })
}

const onHandleMusicClick = () => {  
  router.push({
    name: 'handleMusic'
  })
}

const onShowVehicleDataClick = () => { 
  router.push({
    name: 'vehicleData'
  })
}


</script>

<template>
  <div class="logo-box">
    <img class="logo vite" src="./assets/vite.svg" >
    <img class="logo electron" src="./assets/electron.svg" >
    <img class="logo vue" src="./assets/vue.svg" >
  </div>
  <!-- <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->
  
  <!-- <div class="static-public">
    Place static files into the <code>/public</code> folder
    <img style="width:77px;" :src="'./node.png'" >
  </div> -->

  <div>
    <!--使用 router-link 组件进行导航 -->
    <!--通过传递 `to` 来指定链接 -->
    <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
    <!-- <router-link to="/"> Go to Home </router-link> |     -->
    <el-button type="primary" bg text size="small" @click="onGotoHomeClick"> Go to Home </el-button>
    <router-link to="/about"> Go to About </router-link> |
    <router-link :to="{ name:'helloWorld', params: { msg: 'HelloWorld Msg'} }"> Go to HelloWorld </router-link>
    <el-button type="primary" bg text size="small" @click="onHandleMusicClick"> HandleMusic </el-button>
    <el-button type="primary" bg text size="small" @click="onShowVehicleDataClick"> ShowVehicleData </el-button>

  </div>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>  



</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
}

.static-public {
  display: flex;
  align-items: center;
  justify-content: center;
}

.static-public code {
  background-color: #eee;
  padding: 2px 4px;
  margin: 0 4px;
  border-radius: 4px;
  color: #304455;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9FEAF9);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
