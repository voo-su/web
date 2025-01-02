<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { computed, inject, reactive } from 'vue'
import { useUserStore } from '@/store/user'
import { useDialogueStore } from '@/store/dialogue'
import MessageHeader from '../message/MessageHeader.vue'
import MessageContent from '../message/MessageContent.vue'
import MessageFooter from '../message/MessageFooter.vue'
import { useDialogStore } from '@/store'
import { onRemoveDialog, onSetDisturb } from '@/utils/chat'
import GroupPanel from '../group/GroupPanel.vue'

const userStore = useUserStore()
const dialogueStore = useDialogueStore()
const dialogStore = useDialogStore()

const members = computed(() => dialogueStore.members)

const dialogParams = reactive({
  chatId: computed(() => dialogueStore.chatId),
  uid: computed(() => userStore.uid),
  index_name: computed(() => dialogueStore.index_name),
  type: computed(() => dialogueStore.dialog.dialog_type),
  receiver_id: computed(() => dialogueStore.dialog.receiver_id),
  username: computed(() => dialogueStore.dialog.username),
  avatar: computed(() => dialogueStore.dialog.avatar),
  name: computed(() => dialogueStore.dialog.name),
  surname: computed(() => dialogueStore.dialog.surname),
  online: computed(() => dialogueStore.online),
  keyboard: computed(() => dialogueStore.keyboard),
  is_bot: computed(() => dialogueStore.is_bot),
  num: computed(() => dialogueStore.members.length),
  is_disturb: computed(() => dialogStore.findItem(dialogueStore.index_name).is_disturb)
})

const user: any = inject('$user')

const state = reactive({
  isShowGroupAside: false,
  isShowGroupAds: false
})

const onPanelHeaderEvent = (eventType: any) => {
  const events: any = {
    info: () => user(dialogParams.receiver_id),
    group: () => state.isShowGroupAside = !state.isShowGroupAside,
    disturb: () => {
      onSetDisturb({
        dialog_type: dialogParams.type,
        receiver_id: dialogParams.receiver_id,
        is_disturb: dialogParams.is_disturb,
        index_name: dialogParams.index_name
      })
    },
    // ads: () => {
    //   state.isShowGroupAds = !state.isShowGroupAds
    // }
    remove: () => onRemoveDialog({
      id: dialogParams.chatId,
      index_name: dialogParams.index_name
    })
  }
  events[eventType] && events[eventType]()
}
</script>

<template>
  <el-container class="h-100 is-vertical h-100">
    <message-header
      :data="dialogParams"
      @event="onPanelHeaderEvent"
    />
    <el-main>
      <el-container class="h-100">
        <message-content
          :dialog_type="dialogParams.type"
          :receiver_id="dialogParams.receiver_id"
          :uid="dialogParams.uid"
        />
      </el-container>
    </el-main>
    <message-footer
      v-if="dialogueStore.isShowEditor"
      :dialog_type="dialogParams.type"
      :index_name="dialogParams.index_name"
      :members="members"
      :online="dialogParams.online"
      :receiver_id="dialogParams.receiver_id"
      :uid="dialogParams.uid"
    />
  </el-container>
  <group-panel
    v-if="state.isShowGroupAside && dialogParams.type === 2"
    :gid="dialogParams.receiver_id"
    @close="state.isShowGroupAside = false"
  />
  <!--  <group-ads-->
  <!--    v-if="state.isShowGroupAds"-->
  <!--    :group-id="dialogParams.receiver_id"-->
  <!--    @close="state.isShowGroupAds = false"-->
  <!--  />-->
</template>

<style lang="scss" scoped>
.scrollbar {
  border-left: 1px solid var(--el-border-color);
}
</style>
