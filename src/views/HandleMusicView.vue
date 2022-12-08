<script setup lang="ts">
import { ref, shallowReactive, shallowRef } from 'vue'
import { ElNotification, NotificationHandle } from 'element-plus'
import { dialog } from '@electron/remote'

import FormatRename from '../components/HandlerMucisView/FormatRename.vue'

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
  }
}

const onSelectChange = (value: any) => {
  console.log(value);

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

const logHistory = ref("")

</script>

<template>
  <p>This is HandleMusicView</p>
  <div class="flex-main">
    <div>
      <el-input class="flex-item input" readonly v-model="dicPath" placeholder="点击右侧按钮选择目录">
        <template #prepend>路径：</template>
      </el-input>
      <el-button class="flex-item" color="#626aef" :dark="false" @click="onSelectDicClick">选择文件夹...</el-button>
    </div>

  </div>
  <div class="flex-select">
    <el-radio-group v-model="operateType" @change="onSelectChange">
      <el-radio v-for="(item, index) in OPERATE_TYPE" :key="index" :label="item.KEY"> {{ item.VALUE }} </el-radio>
    </el-radio-group>
  </div>

  <div class="flex-logarea">
    <el-input class="textarea" v-model="logHistory" clearable readonly type="textarea" />
  </div>

  <div>
    <FormatRename v-if="operateType == OPERATE_TYPE.FORMAT_RENAME.KEY" :dicPath="dicPath"></FormatRename>
    <!-- <component :is="currSelectComp"></component> -->
  </div>


</template>

<style scoped lang="less">
.flex-main {
  display: flex;
  justify-content: space-around;

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
  // width: 900px;
  justify-content: center;
  margin-top: 20px;

  .textarea {
    width: 900px
  }
}
</style>
