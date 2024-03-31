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
      <span>исключил(а)</span>
      <template v-for="(user, index) in extra.members">
        <a @click="showUserModal(user.user_id)">{{ user.username }}</a>
        <em v-show="index < extra.members.length - 1">,</em>
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
