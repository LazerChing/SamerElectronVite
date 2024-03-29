<script setup lang="ts">
import { ref, getCurrentInstance, inject, reactive, computed, toRefs, toRef, h, render, createApp, createVNode, watch, VNode } from 'vue'
import { Eleme } from '@element-plus/icons-vue'
import { ElDialog, ElMessage, ElNotification, FormInstance, FormRules } from 'element-plus'
import axios from 'axios'

import { formatTimestamp } from '../utils/TimeUtils'
import { useBydInfoStore } from '@/store/bydInfo'
import AmapContainer from '@/components/Map/AmapContainer.vue'
const bydInfoStore = useBydInfoStore()
// 转为响应式对象，便于原属性值修改后能同步到界面显示
const { carInfo, carData } = toRefs(bydInfoStore)

//#region 全局属性的使用
// 方式1，通过 getCurrentInstance 获取全局属性
// const { proxy: any } = getCurrentInstance()
// console.log("http", proxy.$http);
// 方式2，通过 inject 接收
// const $axios: any = inject("$axios")
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
//#endregion

const ruleFormRef = ref<FormInstance>()
const isGetCarInfoEnable = ref(true)
const isGetCarDataEnable = ref(false)
const AmapVNode = ref<VNode | null>(null)
const carAddr = ref('')
const carSoc = ref(0)
const locationDlgEnabled = ref(false) // 用来控制display属性是否为none（是否创建了并挂载到节点树）
const locationDlgVisible = ref(false) // 用来控制visibility属性是否为visible（是否可见）

type AutoRuleForm = {
  cookieStr: string,
}

const ruleForm = reactive<AutoRuleForm>({
  cookieStr: import.meta.env.VITE_MY_BYD_COOKIE || '',
})

const validateCookie = (rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请输入Cookie'))
  } else {
    callback()
  }
}
const validateCardId = (rule: any, value: string, callback: Function) => {
  // if (value === '') {
  //   callback(new Error('请输入车架号'))
  // } else {
  //   callback()
  // }
  callback()
}
const validateCarType = (rule: any, value: any, callback: Function) => {
  // if (!value) {
  //   callback(new Error('请选择车辆类型'))
  // } else {
  //   callback()
  // }
  callback()
}

const formRules = reactive<FormRules>({
  cookieStr: [{ type: 'string', required: true, validator: validateCookie, trigger: 'blur' }],
  cardIdStr: [{ type: 'string', required: false, validator: validateCardId, trigger: 'blur' }],
  autoType: [{ type: 'any', required: false, validator: validateCarType, trigger: 'change' }],
})

const onGetCarDataClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      isGetCarDataEnable.value = false

      const data = await bydInfoStore.getCarData();
      console.log('carData:', data);
      if (data) {
        ElMessage.success(`车辆数据获取成功`)
        carSoc.value = bydInfoStore.carData?.soc || carSoc.value
      }
      const carLocation = await bydInfoStore.getCarLocation();
      console.log('carLocation:', carLocation);
      if (carLocation) {
        ElMessage.success(`车辆位置获取成功`)
        locationDlgEnabled.value = true
      }
      isGetCarDataEnable.value = true
    }
  })
}

const onGetCarInfoClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      isGetCarInfoEnable.value = false
      const data = await bydInfoStore.getCarInfo(ruleForm.cookieStr);
      console.log('onGetCarInfoClick:', data);

      if (data) {
        ElMessage.success(`车辆信息获取成功`)
        isGetCarDataEnable.value = true
      }
      isGetCarInfoEnable.value = true
    }
  })
}

const createAmapVNode = () => {
  AmapVNode.value = h(
    AmapContainer,
    {
      centerPos: bydInfoStore.locationPosArr,
    }
  )
  return AmapVNode.value
}

const onLocationClick = () => {
  if (bydInfoStore.carLocationData) {
    locationDlgEnabled.value = true
    locationDlgVisible.value = true
    // _alertMapDlg()
  }
}

// const _alertMapDlg = () => {
//   const container = document.createElement('div')
//   // 这里有个问题：ElDialog每弹出一次，遮罩(el-overlay)都会增加一个，不会自动remove掉
//   const dialogVnode = h(
//     ElDialog,
//     {
//       modelValue: locationDlgEnabled.value,
//       alignCenter: true,
//       appendToBody: true,
//       title: '车辆位置',
//       width: '80%',
//       destroyOnClose: true,
//       onClosed: () => {
//         if (container) {
//           container.remove()
//           locationDlgEnabled.value = false
//         }
//       }
//     },
//     {
//       // 不使用default插槽会报提醒
//       default: () => {
//         return [
//           h(
//             AmapContainer,
//             {
//               centerPos: bydInfoStore.locationPosArr,
//             }
//           )
//         ]
//       }
//     }
//   )
//   render(dialogVnode, container)
//   document.body.appendChild(container)
// }

const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]

const progressState = computed(() => {
  if (carSoc.value <= 30) {
    return 'exception'
  } else if (carSoc.value <= 50) {
    return 'warning'
  } else if (carSoc.value <= 70) {
    return ''
  } else if (carSoc.value <= 100) {
    return 'success'
  }
  return ''
})

const onUpdateCarAddr = (address: string) => {
  carAddr.value = address
}

const getXhToolTip = () => {
  let estimatedXh = bydInfoStore.estimatedXhText()
  if (!estimatedXh) {
    return '暂无预估续航数据'
  }
  let actualXh = bydInfoStore.actualXhText();
  let discount = Number(parseInt(estimatedXh) / parseInt(actualXh) * 100).toFixed(1)
  return `根据最近50km能耗预估实际可用续航为：${estimatedXh}，打折率${discount}%`
}

</script>

<template>
  <p>This is VehicleDataView</p>

  <el-form class="car-form" ref="ruleFormRef" :model="ruleForm" status-icon :rules="formRules" label-width="120px"
    label-suffix=":">
    <el-form-item class="car-form-cookie" label="输入Cookie" prop="cookieStr">
      <el-input v-model="ruleForm.cookieStr" autocomplete="true" clearable />
    </el-form-item>
    <el-button class="btn-get-car-info" color="#626aef" plain :loading-icon="Eleme" :loading="!isGetCarInfoEnable"
      @click="onGetCarInfoClick(ruleFormRef)">获取车辆信息
    </el-button>
  </el-form>

  <el-form class="car-form-info" v-if="carInfo" label-width="100px" label-suffix=":">
    <el-form-item class="car-form-info-item" label="您的车架号">
      <el-input :value="carInfo[0]?.vin" readonly />
    </el-form-item>

    <el-form-item class="car-form-info-item" label="您的车辆">
      <el-input :value="carInfo[0]?.autoType" readonly />
    </el-form-item>
    <el-form-item class="car-form-info-item" label="您的车牌">
      <el-input :value="carInfo[0]?.autoPlate" readonly />
    </el-form-item>
    <el-button class="btn-get-car-info" color="#626aef" plain :loading-icon="Eleme" :loading="!isGetCarDataEnable"
      @click="onGetCarDataClick(ruleFormRef)">获取车辆数据
    </el-button>
  </el-form>


  <div class="car-data">
    <div class="car-data-time" v-if="carData">
      <el-divider class="divider" />
      更新时间：{{ formatTimestamp(carData.time) }}
    </div>
    <div class="car-data-soc">
      <el-progress :indeterminate="true" type="dashboard" :percentage="carSoc" :color="progressColors">
        <template #default="{ percentage }">
          <span class="percentage-value">{{ percentage }}%</span>
          <br>
          <span class="percentage-label">剩余电量</span>
        </template>
      </el-progress>
    </div>
    <div class="car-data-xh">
      <el-tooltip :content="getXhToolTip()" placement="top-end" effect="dark">
        <el-progress :percentage="(carData && carSoc || 100)" :status="progressState" :text-inside="true"
          :stroke-width="20" :format="bydInfoStore.actualXhText">
        </el-progress>
      </el-tooltip>
    </div>
    <div class="car-data-nh" v-if="carData">
      <div>
        最近50km能耗：{{ (carData?.nh) + '度/百公里' }}
      </div>
      <div>
        累计能耗：{{ (carData?.ljnh) }}
      </div>
    </div>
    <div v-if="carData" style="position:relative; margin:auto">
      <el-image class="car-img" :src="bydInfoStore.carImgScr" fit="fill" />
    </div>
    <div class="car-data-ty" v-if="carData">
      <div class="car-data-ty-top">
        <div>
          {{ (carData?.ltylzzq) + 'kPa' }}
        </div>
        <div>
          {{ (carData?.ltylzyq) + 'kPa' }}
        </div>
      </div>
      <div class="car-data-ty-down">
        <div>
          {{ (carData?.ltylzzh) + 'kPa' }}
        </div>
        <div>
          {{ (carData?.ltylzyh) + 'kPa' }}
        </div>
      </div>
    </div>
    <div class="car-data-zlc" v-if="carData">
      <span>总里程：{{ bydInfoStore.zlcText }}</span>
    </div>
    <div class="car-data-location" v-if="bydInfoStore.carLocationData">
      <div v-if="carAddr != ''">
        <el-link :href="''" icon="Location" @click="onLocationClick">
          <span> {{ `车辆位置：${carAddr}` }}</span>
        </el-link>
      </div>
      <!-- 
        这里不能用 display: none 来处理隐藏：
        因为 none 的时候节点不会渲染（但是会创建节点），地图组件需要依赖节点树，会报错
        所以使用 visibility: hidden来处理隐藏效果
       -->
      <div :style="{ visibility: locationDlgVisible ? 'visible' : 'hidden' }">  
        <el-dialog v-model="locationDlgEnabled" title="车辆位置" align-center width="70%" :lock-scroll="false">
          <AmapContainer :center-pos="bydInfoStore.locationPosArr" @update-addr="onUpdateCarAddr" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.form {
  display: -webkit-flex;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  margin: 0 auto;
}

.car-form {
  .form();
  width: 60%;
  flex-flow: row nowrap;

  &-cookie {
    // margin: 3px auto;
    width: 100%
  }

  .btn-get-car-info {
    margin-left: 20px;
  }
}

.car-form-info {
  .form();
  width: 350px;

  &-item {
    margin-bottom: 4px;
  }
}

.car-img {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -37%);
  width: 447px;
  height: 447px;
  z-index: -1;
}

.car-data {
  display: -webkit-flex;
  display: flex;
  flex-flow: column wrap;
  margin-top: 20px;
  justify-content: center;

  &-time {
    margin-bottom: 20px;
  }

  &-xh {
    width: 350px;
    margin: auto;
  }

  &-nh {
    width: 600px;
    margin: 20px auto;
    display: -ms-flexbox;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
  }

  &-ty {
    display: -webkit-flex;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    width: 640px;
    margin: 0px auto;

    &-top,
    &-down {
      display: -webkit-flex;
      display: flex;
      flex-flow: row, nowrap;
      justify-content: center;
      margin-bottom: 15px;

      >div {
        flex-basis: 128px
      }
    }

    &-top {
      margin-bottom: 66px;
    }
  }

  &-zlc {
    margin-top: 5px;
  }

  &-location {
    margin-top: 5px;
  }

  .percentage-value {
    display: block;
    margin-top: 10px;
    font-size: 28px;
  }

  .percentage-label {
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .divider {
    margin: 10px auto;
    width: 80%;
  }
}
</style>
