<script setup lang="ts">
import { ref, getCurrentInstance, inject, reactive, computed, toRefs, toRef } from 'vue'
import { Eleme } from '@element-plus/icons-vue'
import { ElMessage, ElNotification, FormInstance, FormRules } from 'element-plus'
import axios from 'axios'

import { formatTimestamp } from '../utils/TimeUtils'
import { useBydInfoStore } from '@/store/bydInfo'
const bydInfoStore = useBydInfoStore()
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

const carSoc = ref(0)

type AutoRuleForm = {
  cookieStr: string,
}
const ruleForm = reactive<AutoRuleForm>({
  cookieStr: '',
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
      console.log('onGetCarDataClick:', data);
      if (data) {
        ElMessage.success(`车辆数据获取成功`)
        carSoc.value = bydInfoStore.carData?.soc || carSoc.value
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
      <el-progress :percentage="(carData && carSoc || 100)" :status="progressState" :text-inside="true"
        :stroke-width="20" :format="bydInfoStore.xhText">
      </el-progress>
    </div>
    <div class="car-data-nh" v-if="carData">
      <div>
        最近50km能耗：{{ (carData?.nh) + '度/百公里' }}
      </div>
      <div>
        累计能耗：{{ (carData?.ljnh) }}
      </div>
    </div>
    <div class="car-data-ty" v-if="carData">
      <div class="car-data-ty-top">
        <div>
          左前胎压：{{ (carData?.ltylzzq) + 'kPa' }}
        </div>
        <div>
          右前胎压：{{ (carData?.ltylzyq) + 'kPa' }}
        </div>
      </div>
      <div class="car-data-ty-down">
        <div>
          左后胎压：{{ (carData?.ltylzzh) + 'kPa' }}
        </div>
        <div>
          右后胎压：{{ (carData?.ltylzyh) + 'kPa' }}
        </div>
      </div>
    </div>
    <div class="car-data-zlc" v-if="carData">
      <span>总里程：{{ bydInfoStore.zlcText }}</span>
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
      justify-content: space-evenly;
      margin-bottom: 2px;
    }
  }

  &-zlc {
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

  .divider{
    margin: 10px auto;
    width: 80%;
  }
}
</style>
