<script lang="ts" setup>
import { inject } from 'vue'

defineProps({
  extra: Object,
  data: Object
})

const showUserModal = inject('$user')
</script>

<template>
  <div class="invite-message">
    <div class="sys-text">
      <a @click="showUserModal(extra.owner_id)">
        {{ extra.owner_name }}
      </a>
      <span>Создал чат и пригласил</span>
      <template v-for="(user, index) in extra.members">
        <a @click="showUserModal(user.user_id)">{{ user.username }}</a>
        <em v-show="index < extra.members.length - 1">,</em>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
