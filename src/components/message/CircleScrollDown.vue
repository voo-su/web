<script lang="ts" setup>
import { ArrowDownBold } from '@element-plus/icons-vue'
import { useDialogueStore } from '@/store'

defineProps(['modelValue'])

const dialogueStore = useDialogueStore()
</script>

<template>
  <div
    v-if="modelValue"
    class="circle-scroll-down"
  >
    <div
      v-if="dialogueStore.unreadBubble"
      class="notify unread-count"
    >
      {{ dialogueStore.unreadBubble }}
    </div>
    <el-icon>
      <arrow-down-bold />
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
.circle-scroll-down {
  position: absolute;
  right: 50px;
  bottom: 5%;
  width: 36px;
  height: 36px;
  background-color: #ffffff;
  color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, .2), 0 2px 2px rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .12);
  cursor: pointer;

  .notify {
    position: absolute;
    display: inline-block;
    right: 10px;
    top: -13px;
  }

  &:hover {
    background-color: #dfdfdf;
  }
}
</style>
