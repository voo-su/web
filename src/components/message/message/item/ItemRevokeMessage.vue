<script lang="ts" setup>

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
</script>

<template>
  <div class="revoke-message">
    <div class="content">
      <!--      <span v-if="login_uid == user_id">Вы отозвали сообщение | {{ formatTime(datetime) }}</span>-->
      <!--      <span v-else-if="dialog_type == 1">Данное сообщение удалено | {{ formatTime(datetime) }}</span>-->
      <!--      <span v-else>"{{ username }}" отозвал сообщение | {{ formatTime(datetime) }}</span>-->
      <span v-if="dialog_type == 1">Данное сообщение удалено</span>
      <span v-else>Данное сообщение удалено "{{ username }}"</span>
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
    /* margin: 10px auto; */
    /* background-color: #dcdfe6; */
    /* line-height: 30px; */
    /* padding: 0 8px; */
    /* word-break: break-all; */
    /* word-wrap: break-word; */
    /* user-select: none; */
    /* font-weight: 300; */
    /* display: inline-block; */
    /* border-radius: 3px; */

    span {
      margin: 0 5px;
    }
  }
}
</style>
