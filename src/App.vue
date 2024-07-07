<script lang="ts" setup>
// import { getCurrentInstance } from 'vue'
// import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store'
import socket from '@/utils/socket'
import { listener } from '@/utils/listener'
import ru from 'element-plus/dist/locale/ru.mjs'
import { isLoggedIn } from '@/utils/auth'

const userStore = useUserStore()

if (isLoggedIn()) {
  socket.connect()
  userStore.loadSetting()
}

listener()

// const ctx = getCurrentInstance()
// if (ctx) {
//   const message = ElMessage
//   ElMessage = message
//   ctx.appContext.config.globalProperties.$message = message
// }
</script>

<template>
  <audio
    id="audio"
    muted
    preload="preload"
  >
    <source
      src="@/assets/audio/notification.mp3"
      type="audio/mp3"
    >
  </audio>
  <el-config-provider :locale="ru">
    <router-view />
  </el-config-provider>
</template>
