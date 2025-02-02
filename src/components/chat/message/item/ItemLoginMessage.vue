<script lang="ts" setup>
import { getBrowserType, getOSType } from '@/utils/util'
import { formatTime } from '@/utils/datetime'
import { useI18n } from 'vue-i18n'

defineProps({
  extra: Object,
  data: Object
})

const { t } = useI18n()
</script>

<template>
  <section class="login-message">
    <h4>{{ t('loginNotification') }}</h4>
    <p>
      {{ t('device') }}: {{ getOSType(extra.agent) }} / {{ getBrowserType(extra.agent) }}
    </p>
    <p>IP: {{ extra.ip }}</p>
    <p>{{ t('loginLocation') }}: {{ extra.address }}</p>
    <p>{{ t('loginTime') }}: {{ formatTime(extra.datetime) }}</p>
  </section>
</template>

<style lang="scss" scoped>
.login-message {
  width: 300px;
  min-height: 50px;
  background: #f7f7f7;
  border-radius: 5px;
  padding: 15px;

  p {
    font-size: 13px;
    margin: 10px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
