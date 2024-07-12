<script lang="ts" setup>
import { markRaw } from 'vue'
import AppLayout from '@/components/app/AppLayout.vue'
import GroupManageDetail from './GroupManageDetail.vue'
import GroupManageMember from './GroupManageMember.vue'
import GroupManageRequests from './GroupManageRequests.vue'
import GroupManageSettings from './GroupManageSettings.vue'
import {
  Postcard as IconPostcard,
  User as IconUser,
  CirclePlus as IconCirclePlus,
  Setting as IconSetting
} from '@element-plus/icons-vue'

const props = defineProps({
  gid: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])
const menus = [
  {
    name: 'Основная информация',
    icon: markRaw(IconPostcard),
    component: GroupManageDetail
  },
  {
    name: 'Участники',
    icon: markRaw(IconUser),
    component: GroupManageMember
  },
  {
    name: 'Заявки',
    icon: markRaw(IconCirclePlus),
    component: GroupManageRequests
  },
  {
    name: 'Управление',
    icon: markRaw(IconSetting),
    component: GroupManageSettings
  }
]

const onCloseClick = () => {
  emit('close')
}
</script>

<template>
  <app-layout
    :id="gid"
    title="Управление группой"
    :menus="menus"
    @close="onCloseClick"
  />
</template>

<style lang="scss" scoped></style>
