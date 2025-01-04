<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

defineProps({
  login_uid: {
    type: Number,
    default: 0
  },
  user_id: {
    type: Number,
    default: 0
  },
  dialog_type: {
    type: Number,
    default: 0
  },
  username: {
    type: String,
    default: ''
  },
  datetime: {
    type: String,
    default: ''
  }
})
const { t } = useI18n()
</script>

<template>
  <div class="revoke-message">
    <div class="content">
      <span v-if="dialog_type == 1">{{ t('messageDeleted') }}</span>
      <span v-else>{{ t('messageDeletedBy', { username: username }) }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.revoke-message {
  display: flex;
  justify-content: center;

  .content {
    color: #979191;
    font-size: 11px;

    span {
      margin: 0 5px;
    }
  }
}
</style>
