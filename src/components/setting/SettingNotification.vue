<script lang="ts" setup>
import { computed } from 'vue'
import { useNotifyStore } from '@/store/notify'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const notifyStore = useNotifyStore()

const isPromptTone = computed({
  get: () => notifyStore.isPromptTone,
  set: val => {
    notifyStore.setPromptTone(val)
  }
})

</script>

<template>
  <section>
    <h3 class="title">
      {{ t('notificationSettings') }}
    </h3>
    <div class="view-box">
      <div class="info-item">
        <div class="content">
          <div class="name">
            {{ t('receiveSoundNotifications') }}
          </div>
        </div>
        <div class="tools">
          <el-switch v-model="isPromptTone" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
