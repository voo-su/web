<script lang="ts" setup>
import { markRaw } from 'vue'
import AppLayoutDialog from '@/components/app/AppLayoutDialog.vue'
import GroupManageDetail from './GroupManageDetail.vue'
import GroupManageMember from './GroupManageMember.vue'
import GroupManageAds from './GroupManageAds.vue'
import GroupManageRequests from './GroupManageRequests.vue'
import GroupManageSettings from './GroupManageSettings.vue'
import {
  Postcard as IconPostcard,
  User as IconUser,
  CirclePlus as IconCirclePlus,
  Setting as IconSetting
} from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  gid: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])

const { t } = useI18n()
const menus = [
  {
    name: t('basicInfo'),
    icon: markRaw(IconPostcard),
    component: GroupManageDetail
  },
  {
    name: t('groupParticipants'),
    icon: markRaw(IconUser),
    component: GroupManageMember
  },
  {
    name: t('groupRequests'),
    icon: markRaw(IconCirclePlus),
    component: GroupManageRequests
  },
  {
    name: t('groupAnnouncements'),
    icon: markRaw(IconUser),
    component: GroupManageAds
  },
  {
    name: t('groupSettings'),
    icon: markRaw(IconSetting),
    component: GroupManageSettings
  }
]

const onCloseClick = () => {
  emit('close')
}
</script>

<template>
  <app-layout-dialog
    :id="gid"
    :title="t('groupManagement')"
    :menus="menus"
    @close="onCloseClick"
  />
</template>

<style lang="scss" scoped></style>
