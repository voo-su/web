<script lang="ts" setup>
import { useUserStore } from '@/store'
import socket from '@/utils/socket'
import { listener } from '@/utils/listener'
import ru from 'element-plus/dist/locale/ru.mjs'
import { pushInit } from '@/utils/push'
import { CStorage } from '@/utils/storage'
import { ACCESS_TOKEN } from '@/constants/storage'

const userStore = useUserStore()

if (CStorage.exists(ACCESS_TOKEN)) {
  socket.connect()
  userStore.loadSetting()
  pushInit()
}

listener()
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
