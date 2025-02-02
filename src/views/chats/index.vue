<script lang="ts" setup>
import { onUnmounted } from 'vue'
import { useMessageStore } from '@/store/message'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ChatMessageContent from '@/components/chat/ChatMessageContent.vue'
import ChatSide from '@/components/chat/ChatSide.vue'
import ChatMessageGreeting from '@/components/chat/ChatMessageGreeting.vue'

const messageStore = useMessageStore()

onUnmounted(() => {
  messageStore.$reset()
})
</script>

<template>
  <default-layout>
    <el-container class="h-100">
      <el-aside>
        <chat-side />
      </el-aside>
      <el-main class="chat-message-list">
        <component :is="messageStore.index_name ? ChatMessageContent : ChatMessageGreeting" />
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

.chat-message-list {
  margin-left: 15px;
  background: #FFFFFF;
  border-radius: 16px;
}
</style>
