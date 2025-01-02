<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { computed } from 'vue'
import { useNotifyStore } from '@/store/notify'

const notifyStore = useNotifyStore()

const isPromptTone = computed({
  get: () => notifyStore.isPromptTone,
  set: val => {
    notifyStore.setPromptTone(val)
  }
})

const isKeyboard = computed({
  get: () => notifyStore.isKeyboard,
  set: val => {
    notifyStore.setKeyboard(val)
  }
})

const isWebNotify = computed({
  get: () => notifyStore.isWebNotify,
  set: val => {
    if (val === false) {
      notifyStore.isWebNotify = false
    } else {
      window.Notification.requestPermission(res => {
        notifyStore.isWebNotify = 'granted' === res
      })
    }
  }
})
</script>

<template>
  <section>
    <h3 class="title">
      Настройки уведомлений
    </h3>
    <div class="view-box">
      <div class="info-item">
        <div class="content">
          <div class="name">
            Получать уведомления со звуком
          </div>
        </div>
        <div class="tools">
          <el-switch v-model="isPromptTone" />
        </div>
      </div>
      <!--      <div class="info-item">-->
      <!--        <div class="content">-->
      <!--          <div class="name">-->
      <!--            Уведомлять о вводе с клавиатуры-->
      <!--          </div>-->
      <!--          <div class="description">-->
      <!--            Уведомлять о вводе с клавиатуры: {{ isKeyboard ? 'Включено' : 'Выключено' }}-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="tools">-->
      <!--          <el-switch v-model="isKeyboard" />-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="info-item">-->
      <!--        <div class="content">-->
      <!--          <div class="name">-->
      <!--            Уведомления о сообщениях-->
      <!--          </div>-->
      <!--          <div class="description">-->
      <!--            Уведомления о сообщениях: {{ isWebNotify ? 'Включено' : 'Выключено' }}-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="tools">-->
      <!--          <el-switch v-model="isWebNotify" />-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </section>
</template>

<style scoped></style>
