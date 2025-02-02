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
      <a @click="showUserModal(extra.owner_id)">
        {{ extra.owner_name }}
      </a>
      <span>{{ t('invitedToChat') }}</span>
      <template v-for="(user, index) in extra.members">
        <a @click="showUserModal(user.user_id)">{{ user.username }}</a>
        <em v-show="index < extra.members.length - 1">,</em>
      </template>
      <span>{{ t('toChat') }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
