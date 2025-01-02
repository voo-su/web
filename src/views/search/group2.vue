<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { computed, onMounted, reactive, ref } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { getGroupListApi } from '@/api/group-chat'
import GroupPanel from '@/components/message/group/GroupPanel.vue'
import GroupLaunch from '@/components/message/group/GroupLaunch.vue'
import GroupRequestCard from '@/components/message/group/GroupRequestCard.vue'
import { toDialog } from '@/utils/chat'
import { useDialogStore, useUserStore } from '@/store'

const userStore = useUserStore()
const dialogStore = useDialogStore()
const isShowCreateGroupBox = ref<boolean>(false)
const keywords = ref<string>('')
const items = ref<any>([])

const params = reactive({
  isShow: false,
  id: 0
})

const tabIndex = ref<string>('all')

const { uid } = userStore

const filterCreator = computed(() => {
  return items.value.filter((item: any) => item.creator_id == uid)
})

const filter: any = computed(() => {
  return items.value.filter((item: any) => {
    if (tabIndex.value == 'create' && item.creator_id != uid) {
      return false
    }
    if (tabIndex.value == 'join' && item.creator_id == uid) {
      return false
    }
    return (
      item.group_name.toLowerCase().indexOf(keywords.value.toLowerCase()) != -1
    )
  })
})

const onLoadData = () => {
  getGroupListApi().then((res: any) => {
    if (res.code == 200) {
      items.value = res.data.items || []
    }
  })
}

const onShowGroup = (item: any) => {
  params.isShow = true
  params.id = item.id
}

const onToDialog = (item: any) => {
  toDialog(2, item.id)
}

const onGroupCallBack = () => {
  isShowCreateGroupBox.value = false
  onLoadData()
  dialogStore.loadDialogList()
}

onMounted(() => {
  onLoadData()
})
</script>

<template>
  <el-container
    id="drawer-target"
    class="is-vertical h-100"
  >
    <el-header class="from-header">
      <el-space>
        <el-input
          v-model="keywords"
          :prefix-icon="Search"
          placeholder="Поиск"
        />
        <el-button
          :icon="Plus"
          @click="isShowCreateGroupBox = true"
        />
      </el-space>
      <!--      <el-tabs v-model="tabIndex">-->
      <!--        <el-tab-pane name="all">-->
      <!--          Все группы ({{ items.length }})-->
      <!--        </el-tab-pane>-->
      <!--        <el-tab-pane name="create">-->
      <!--          Группы, которые я создал ({{ filterCreator.length }})-->
      <!--        </el-tab-pane>-->
      <!--        <el-tab-pane name="join">-->
      <!--          Группы, в которые я вступил ({{ items.length - filterCreator.length }})-->
      <!--        </el-tab-pane>-->
      <!--      </el-tabs>-->
    </el-header>
    <el-main class="scrollbar p-10">
      <div
        v-if="filter.length == 0"
        class="empty"
      >
        Ничего не найдено.
      </div>
      <group-request-card
        v-else
        v-for="item in filter"
        :about="item.description"
        :avatar="item.avatar"
        :gender="item.gender"
        :is-member="true"
        :username="item.group_name"
        @click="onShowGroup(item)"
        @dialog="onToDialog(item)"
      />
    </el-main>
  </el-container>
  <group-launch
    v-model="isShowCreateGroupBox"
    @close="isShowCreateGroupBox = false"
    @on-submit="onGroupCallBack"
  />
  <el-drawer
    v-model:show="params.isShow"
    :block-scroll="false"
    :trap-focus="false"
    :width="400"
    placement="right"
    to="#drawer-target"
  >
    <group-panel
      :gid="params.id"
      @close="params.isShow = false"
      @to-dialog="
        () => {
          toDialog(2, params.id)
        }
      "
    />
  </el-drawer>
</template>

<style lang="scss" scoped>
.from-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: 1px solid var(--el-border-color);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: 12px;
  gap: 12px;
}
</style>
