<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { getBrowserType, getOSType } from '@/utils/util'
import { formatTime } from '@/utils/datetime'

defineProps({
  extra: Object,
  data: Object
})

</script>

<template>
  <section class="login-message">
    <h4>Уведомление о входе в систему</h4>
    <p>
      Устройство: {{ getOSType(extra.agent) }} / {{ getBrowserType(extra.agent) }}
    </p>
    <p>IP: {{ extra.ip }}</p>
    <p>Место входа: {{ extra.address }}</p>
    <p>Время входа: {{ formatTime(extra.datetime) }}</p>
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
