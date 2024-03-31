<script lang="ts" setup>
import { markRaw, ref } from 'vue'
import LayoutTab from '@/components/app/AppLayoutTab.vue'
import DetailTab from './DetailManageTab.vue'
import MemberTab from './MemberTab.vue'

import { Postcard, User } from '@element-plus/icons-vue'

const emit = defineEmits(['close'])
const props = defineProps({
  gid: {
    type: Number,
    default: 0
  }
})

const isShowBox = ref(true)
const tabIndex = ref(0)
const menus = [
  {
    name: 'Информация о группе',
    icon: markRaw(Postcard),
    component: DetailTab
  },
  {
    name: 'Участники',
    icon: markRaw(User),
    component: MemberTab
  }
  // {
  //   name: 'Объявления группы',
  //   icon: markRaw(User),
  //   component: NoticeTab
  // },
  // {
  //   name: 'Заявки в группу',
  //   icon: markRaw(User),
  //   component: ApplyTab
  // },
  // {
  //   name: 'Настройки группы',
  //   icon: markRaw(User),
  //   component: ConfigTab
  // }
]

const onCloseClick = () => {
  emit('close')
}

</script>

<template>
  <layout-tab
    :id="gid"
    title="Управление группой"
    :menus="menus"
    @close="onCloseClick"
  />
</template>

<style lang="scss" scoped>

</style>
