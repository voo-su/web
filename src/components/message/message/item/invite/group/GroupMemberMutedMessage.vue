<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

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
      <span>установил(а) ограничение чата для</span>
      <template v-for="(user, index) in extra.members">
        <a @click="showUserModal(user.user_id)">{{ user.username }}</a>
        <em v-show="index < extra.members.length - 1">,</em>
      </template>
      <span>на отправку сообщений</span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
