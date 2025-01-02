<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { markRaw, reactive } from 'vue'
import SecurityBox from '@/components/setting/box/SecurityBox.vue'
import EmailBox from '@/components/setting/box/EmailBox.vue'
import UsernameBox from '@/components/setting/box/UsernameBox.vue'

const state = reactive({ component: markRaw(SecurityBox) })

const onClick = (key: string) => {
  const component: any = {
    security: SecurityBox,
    email: EmailBox,
    username: UsernameBox
  }

  state.component = component[key] && markRaw(component[key])
}
</script>

<template>
  <component
    :is="state.component"
    @on-click="onClick"
  />
</template>

<style scoped>

</style>
