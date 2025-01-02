<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { onUnmounted } from 'vue'
import { useDialogueStore } from '@/store/dialogue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DialogContent from '@/components/message/chat/DialogContent.vue'
import DialogSide from '@/components/message/chat/DialogSider.vue'
import DialogGreeting from '@/components/message/chat/DialogGreeting.vue'

const dialogueStore = useDialogueStore()

onUnmounted(() => {
  dialogueStore.$reset()
})
</script>

<template>
  <default-layout>
    <el-container class="h-100">
      <el-aside>
        <dialog-side />
      </el-aside>
      <el-main class="dialog-list">
        <component :is="dialogueStore.index_name ? DialogContent : DialogGreeting" />
      </el-main>
    </el-container>
  </default-layout>
</template>

<style lang="scss" scoped>
.el-aside {
  width: 340px;
  position: relative;
  user-select: none;
  overflow: unset !important;
}

.dialog-list{
  margin-left: 15px;
  background: #FFFFFF;
  border-radius: 16px;
}
</style>
