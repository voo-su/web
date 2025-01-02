<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

// import { getCurrentInstance } from 'vue'
// import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store'
import socket from '@/utils/socket'
import { listener } from '@/utils/listener'
import ru from 'element-plus/dist/locale/ru.mjs'
import { isLoggedIn } from '@/utils/auth'
import { pushInit } from '@/utils/push'

const userStore = useUserStore()

if (isLoggedIn()) {
  socket.connect()
  userStore.loadSetting()
  pushInit()
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
