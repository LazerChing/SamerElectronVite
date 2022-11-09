<script setup lang="ts">
import { ref, getCurrentInstance, inject } from 'vue'
import { ElNotification, NotificationHandle } from 'element-plus'
import axios from 'axios'
import { apiGetVehicleRealTimeResult } from '../http/apis/bydApis'

// 方式1，通过 getCurrentInstance 获取全局属性
// const { proxy: any } = getCurrentInstance()
// console.log("http", proxy.$http);
// 方式2，通过 inject 接收
const $axios: any = inject("$axios")

// 测试 start
// proxy.$http.get('https://api.github.com/users').then((resp) => {    
//     console.log("$http: ", resp.data)
//   }).catch((err) => {
//     console.log(err)
//   })

// $axios.get('https://api.github.com/users').then((resp) => {    
//     console.log("$axios: ", resp.data)
//   }).catch((err) => {
//     console.log(err)
//   })
// 测试 end


const isGetInfoEnable = ref(true)
document.cookie = 'openid=d4bc54a7bbc941d5befd126c8e9276481667381691185; 0ab08166-73d7-42ac-a569-02ee6710ea63=3807a8bb1a62c923c4da621150f1739e'
const getInfo = ()=> {
  isGetInfoEnable.value = false
  apiGetVehicleRealTimeResult().then((res) => {
    console.log(res);    
  }).finally(() => {
    isGetInfoEnable.value = true
  })

  // $axios.get('https://api.github.com/users').then((resp) => {    
  //   console.log("$axios: ", resp.data)
  // }).catch((err) => {
  //   console.log(err)
  // }).finally(() => {
  //   isGetInfoEnable.value = true
  // })

  // $axios.post('https://bydcloud.byd.com/wechat/Vehicle/vehicleRealTimeResult').then((resp) => {    
  //   console.log("$axios: ", resp.data)
  // }).catch((err) => {
  //   console.log(err)
  // }).finally(() => {
  //   isGetInfoEnable.value = true
  // })
}


</script>

<template>
  <p>This is VehicleDataView</p>  
  <div class="car-main">
    <el-button type="primary" bg text size="small" :disabled="!isGetInfoEnable" @click="getInfo"> 获取信息 </el-button>
  </div>
</template>

<style scoped>

</style>
