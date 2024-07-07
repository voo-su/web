<script lang="ts" setup>
import { inject } from 'vue'

defineProps({
  extra: Object,
  data: Object
})

const showUserModal = inject<any>('$user')
</script>

<template>
  <div class="invite-message">
    <div class="sys-text">
      <a @click="showUserModal(extra.owner_id)">
        {{ extra.owner_name }}
      </a>
      <span>Отменено ограничение чата для всех участников</span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
