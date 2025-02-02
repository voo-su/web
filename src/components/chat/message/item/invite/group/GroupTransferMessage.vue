<script lang="ts" setup>
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps({
  extra: Object,
  data: Object
})

const { t } = useI18n()
const showUserModal = inject<any>('$user')
</script>

<template>
  <div class="invite-message">
    <div class="sys-text">
      <a @click="showUserModal(extra.old_owner_id)">{{ extra.old_owner_name }}</a>
      <span>{{ t('transferredGroupOwnership') }}</span>
      <a @click="showUserModal(extra.new_owner_id)">{{ extra.new_owner_name }}</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
