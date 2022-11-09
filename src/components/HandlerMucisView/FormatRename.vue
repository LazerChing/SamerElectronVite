<script setup lang="ts">
import { ref } from 'vue'
// import { ElNotification, NotificationHandle } from 'element-plus'
import fs from 'fs';
import path from 'path';
const props = defineProps<{
  dicPath: string
}>()

const originFormat = ref("")
const aimFormat = ref("")
const modifyBtnDisable = ref(false)

const onModifyClick = () => {
  // modifyBtnDisable.value = true
  if (props.dicPath == "" || originFormat.value == "" || aimFormat.value == "") return 
  let files = fs.readdirSync(props.dicPath)
  files.forEach(file =>{
    if (path.extname(file) == `.${originFormat.value}`) {
      let dotIndex = file.lastIndexOf('.')
      let oldName = file.substring(0, dotIndex)
      
      console.log(oldName);
      let newFile = `${oldName}.${aimFormat.value}`
      console.log(`修改：${file} -----> ${newFile}`);
      fs.renameSync(path.join(props.dicPath, file), path.join(props.dicPath, newFile))
    }
  })  
}


</script>

<template>
  <div class="renameFomat">
    <div class="item">
      需要修改的格式后缀：<el-input class="input" v-model="originFormat" placeholder="如mp3"/>
    </div>
    <div class="item">
      想把格式名更改为：<el-input class="input" v-model="aimFormat" placeholder="如flac"/>
    </div>
    <el-button :disabled="modifyBtnDisable" class="button" type="primary" @click="onModifyClick"> 开始修改</el-button>
  </div>
  <div>
  </div>
</template>

<style scoped lang="less">
.renameFomat{
  display: flex;
  justify-content: center;
  align-content: space-around;
  margin-top: 30px;
  .item{
    margin-left: 10px;
    .input{
      width: 200px;
    }
  }
  .button{
    margin-left: 20px;
  }
}
</style>
