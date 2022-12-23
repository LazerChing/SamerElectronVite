<script setup lang="ts">
import { computed, ref } from 'vue'
// import { ElNotification, NotificationHandle } from 'element-plus'
import fs from 'fs';
import path from 'path';
const props = defineProps<{
  dicPath: string
}>()

const emit = defineEmits(['updateLog'])

const originFormat = ref("")
const aimFormat = ref("")
const modifyBtnDisable = ref(false)

const _checkInput = () => {
  if (!props.dicPath || !originFormat.value || !aimFormat.value) {
    return false
  }
  return true
}

// 是否启用提示
const enableBtnToolTip = computed(() => {
  return _checkInput()
})


const toolTipContent = computed(() => {
  if (!props.dicPath) { return '请先指定目录' }
  if (!originFormat.value) { return '请指定原格式名' }
  if (!aimFormat.value) { return '请指定目标格式名' }
  return ''
})

const emitLogInfo = (logInfo: any) => {
  emit("updateLog", logInfo)
}

const onModifyClick = () => {
  // modifyBtnDisable.value = true
  if (!_checkInput()) { emitLogInfo('请检查输入'); return }
  let files = fs.readdirSync(props.dicPath)
  let handledFiles = 0;
  files.forEach(file => {
    if (path.extname(file) == `.${originFormat.value}`) {
      let dotIndex = file.lastIndexOf('.')
      let oldName = file.substring(0, dotIndex)

      console.log(oldName);
      let newFile = `${oldName}.${aimFormat.value}`
      const logInfo = `修改：${file} -----> ${newFile}`
      console.log(logInfo);
      emitLogInfo(logInfo)
      fs.renameSync(path.join(props.dicPath, file), path.join(props.dicPath, newFile))
      handledFiles++
    }
  })
  if (handledFiles === 0) { emitLogInfo('没有改动的文件') }
  else if (handledFiles === files.length) { emitLogInfo('已全部更改完毕') }
}


</script>

<template>
  <div class="renameFomat">
    <div class="item">
      需要修改的格式：<el-input class="input" v-model="originFormat" placeholder="如mp3" />
    </div>
    <div class="item">
      想把格式名更改为：<el-input class="input" v-model="aimFormat" placeholder="如flac" />
    </div>
    <el-tooltip :content='toolTipContent' placement="bottom" :disabled="enableBtnToolTip">
      <el-button class="button item" :disabled="modifyBtnDisable" type="primary" @click="onModifyClick">
        开始修改</el-button>
    </el-tooltip>
  </div>
  <div>
  </div>
</template>

<style scoped lang="less">
.renameFomat {
  display: flex;
  justify-content: center;
  flex-flow: column wrap;
  // align-content: space-around;
  align-content: center;
  margin-top: 30px;

  .item {
    margin-bottom: 10px;

    .input {
      width: 200px;
    }
  }

  .button {
    // margin-left: 20px;
    margin: auto;
    width: 150px;
  }
}
</style>
