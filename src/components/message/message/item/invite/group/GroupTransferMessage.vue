<script lang="ts" setup>
import { inject } from 'vue'

const showUserModal = inject('$user')

defineProps({
  extra: Object,
  data: Object
})
</script>

<template>
  <div class="invite-message">
    <div class="sys-text">
      <a @click="showUserModal(extra.old_owner_id)">{{ extra.old_owner_name }}</a>
      <span>передал(а) группу владельцу</span>
      <a @click="showUserModal(extra.new_owner_id)">{{ extra.new_owner_name }}</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
