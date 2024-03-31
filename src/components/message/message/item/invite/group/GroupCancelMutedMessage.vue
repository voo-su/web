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
      <a @click="showUserModal(extra.owner_id)">
        {{ extra.owner_name }}
      </a>
      <span>Отменено ограничение чата для всех участников</span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
