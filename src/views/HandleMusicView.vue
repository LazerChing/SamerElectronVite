<script setup lang="ts">
import { computed, reactive, ref, shallowReactive, shallowRef, watchEffect } from 'vue'
import { ElNotification, NotificationHandle } from 'element-plus'
import { dialog } from '@electron/remote'

import FormatRename from '../components/HandlerMucisView/FormatRename.vue'
import { formatTimestamp } from '@/utils/TimeUtils';
import fs from 'fs';

interface TYPE_OPERATE {
  [name: string]: {
    KEY: string,
    VALUE: string,
    COMP?: Object
  }
}

const OPERATE_TYPE = shallowRef<TYPE_OPERATE>({
  FORMAT_RENAME: {
    KEY: "formatRename",
    VALUE: "批量修改格式",
    COMP: FormatRename
  },
  FORMAT_RENAME2: {
    KEY: "formatRename2",
    VALUE: "批量修改格式2",
  }
})
const dicPath = ref("")

const onSelectDicClick = () => {
  const path = dialog.showOpenDialogSync({
    title: "请指定路径",
    // buttonLabel: "选择此文件夹",
    properties: [
      // "openFile", // - 允许选择文件
      "openDirectory", // - 允许选择文件夹
    ]
  })
  console.log(path);

  if (path) {
    dicPath.value = path[0]
    const files = fs.readdirSync(dicPath.value)
    let fileNames = ''
    let num = 0;
    files.forEach(file => {
      fileNames += `\n[${++num}] ${file}`
    })
    fileNames && _addLog(`当前目录下文件：${fileNames}`)
  }
}

const onSelectChange = (value: any) => {
  for (const key in OPERATE_TYPE.value) {
    const item = OPERATE_TYPE.value[key];
    if (item.KEY == value && item.COMP) {
      currSelectComp.value = item.COMP;
    }
  }
}

const currSelectObj = OPERATE_TYPE.value.FORMAT_RENAME
const operateType = ref(currSelectObj.KEY)
const currSelectComp = shallowRef(currSelectObj.COMP)
const logHistory = ref('')
const MAX_LOG_COUNT = 100

const logArrs = reactive<any[]>([])
watchEffect(() => {
  logHistory.value = ''
  for (let i = logArrs.length; i > 0; i--) {
    logHistory.value += logArrs[i - 1]
  }
})

const onUpdateLog = (logInfo: any) => {
  _addLog(logInfo)
}

const _addLog = (logInfo: any) => {
  const now = formatTimestamp(Date.now())
  if (logArrs.length >= MAX_LOG_COUNT) {
    logArrs.shift()
  }
  const newLogInfo = `[${now}] ${logInfo}\n`
  logArrs.push(newLogInfo)
}

const onClearClick = () => {
  logArrs.length = 0
}

</script>

<template>
  <p>This is HandleMusicView</p>
  <div class="flex-main">
    <el-input class="flex-item input" readonly v-model="dicPath" placeholder="点击右侧按钮选择目录">
      <template #prepend>路径：</template>
    </el-input>
    <el-button class="flex-item" color="#626aef" :dark="false" @click="onSelectDicClick">选择文件夹...</el-button>
  </div>
  <div class="flex-select">
    <el-radio-group v-model="operateType" @change="onSelectChange">
      <el-radio v-for="(item, index) in OPERATE_TYPE" :key="index" :label="item.KEY"> {{ item.VALUE }} </el-radio>
    </el-radio-group>
  </div>

  <div class="flex-logarea">
    <el-button class="button" @click="onClearClick" :disabled="!logHistory"> 清除日志 </el-button>
    <el-input class="textarea" v-model="logHistory" readonly type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" />
  </div>

  <div>
    <FormatRename v-if="operateType == OPERATE_TYPE.FORMAT_RENAME.KEY" :dicPath="dicPath" @updateLog="onUpdateLog">
    </FormatRename>
    <!-- <component :is="currSelectComp"></component> -->
  </div>
</template>

<style scoped lang="less">
.flex-main {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  flex-flow: row nowrap;
  width: 80%;
  margin: auto;

  .flex-item {
    margin-left: 20px;
  }

  .input {
    width: 900px
  }
}

.flex-select {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.flex-logarea {
  display: flex;
  flex-flow: column wrap;
  align-items: flex-end;

  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  width: 800px;

  .button {
    width: 80px;
  }

}
</style>
