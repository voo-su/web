<script lang="ts" setup>
import { computed, inject, reactive } from 'vue'
import { useUserStore } from '@/store/user'
import { useMessageStore } from '@/store/message'
import MessageHeader from './message/MessageHeader.vue'
import MessageContent from './message/MessageContent.vue'
import MessageFooter from './message/MessageFooter.vue'
import { useChatStore } from '@/store'
import { onChatRemove, onSetDisturb } from '@/utils/chat'
import GroupPanel from './GroupPanel.vue'

const userStore = useUserStore()
const messageStore = useMessageStore()
const chatStore = useChatStore()

const members = computed(() => messageStore.members)

const params = reactive({
  chatId: computed(() => messageStore.chatId),
  uid: computed(() => userStore.uid),
  index_name: computed(() => messageStore.index_name),
  type: computed(() => messageStore.chat.chat_type),
  receiver_id: computed(() => messageStore.chat.receiver_id),
  username: computed(() => messageStore.chat.username),
  avatar: computed(() => messageStore.chat.avatar),
  name: computed(() => messageStore.chat.name),
  surname: computed(() => messageStore.chat.surname),
  online: computed(() => messageStore.online),
  keyboard: computed(() => messageStore.keyboard),
  is_bot: computed(() => messageStore.is_bot),
  num: computed(() => messageStore.members.length),
  is_disturb: computed(() => chatStore.findItem(messageStore.index_name).is_disturb)
})

const user: any = inject('$user')

const state = reactive({
  isShowGroupAside: false,
  isShowGroupAds: false
})

const onPanelHeaderEvent = (eventType: any) => {
  const events: any = {
    info: () => user(params.receiver_id),
    group: () => state.isShowGroupAside = !state.isShowGroupAside,
    disturb: () => {
      onSetDisturb({
        chat_type: params.type,
        receiver_id: params.receiver_id,
        is_disturb: params.is_disturb,
        index_name: params.index_name
      })
    },
    // ads: () => {
    //   state.isShowGroupAds = !state.isShowGroupAds
    // }
    remove: () => onChatRemove({
      id: params.chatId,
      index_name: params.index_name
    })
  }
  events[eventType] && events[eventType]()
}
</script>

<template>
  <el-container class="h-100 is-vertical h-100">
    <message-header
      :data="params"
      @event="onPanelHeaderEvent"
    />
    <el-main>
      <el-container class="h-100">
        <message-content
          :chat_type="params.type"
          :receiver_id="params.receiver_id"
          :uid="params.uid"
        />
      </el-container>
    </el-main>
    <message-footer
      v-if="messageStore.isShowEditor"
      :chat_type="params.type"
      :index_name="params.index_name"
      :members="members"
      :online="params.online"
      :receiver_id="params.receiver_id"
      :uid="params.uid"
    />
  </el-container>
  <group-panel
    v-if="state.isShowGroupAside && params.type === 2"
    :gid="params.receiver_id"
    @close="state.isShowGroupAside = false"
  />
  <!--  <group-ads-->
  <!--    v-if="state.isShowGroupAds"-->
  <!--    :group-id="params.receiver_id"-->
  <!--    @close="state.isShowGroupAds = false"-->
  <!--  />-->
</template>

<style lang="scss" scoped>
.scrollbar {
  border-left: 1px solid var(--el-border-color);
}
</style>
