<script lang="ts" setup>
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
