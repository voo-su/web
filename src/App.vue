<script lang="ts" setup>
import { getCurrentInstance } from 'vue'
import { ElDialog, ElMessage, ElMessageBox, ElNotification } from 'element-plus'
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

const ctx = getCurrentInstance()
if (ctx) {
  const message = ElMessage
  const messageBox = ElMessageBox
  const notification = ElNotification
  const dialog = ElDialog

  window['$message'] = message
  window['$messageBox'] = messageBox
  window['$notification'] = notification
  window['$dialog'] = dialog

  ctx.appContext.config.globalProperties.$message = message
  ctx.appContext.config.globalProperties.$messageBox = messageBox
  ctx.appContext.config.globalProperties.$notification = notification
  ctx.appContext.config.globalProperties.$dialog = dialog
}
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
