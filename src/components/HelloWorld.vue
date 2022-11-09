<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification, NotificationHandle } from 'element-plus'
defineProps<{ msg: string }>()

let succNotify: NotificationHandle | null = null
const succNotifyTime = 3000
const onSuccessClick = () => {
  if (succNotify)  {
    // succNotify.close()
    return
  }
  succNotify = ElNotification({
      title: 'Success',
      message: "Element Plus已集成",
      type: 'success',
      duration: succNotifyTime
  })
  setTimeout(()=>{
    succNotify = null
  }, succNotifyTime + 100)
}


const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <el-button @click="count++"> count is: {{ count }}</el-button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>

  
  <el-button :disabled="false" type="success" @click="onSuccessClick">Success</el-button>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
