<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { getGroupListApi } from '@/api/group-chat'
import GroupPanel from '@/components/chat/GroupPanel.vue'
import GroupLaunch from '@/components/chat/GroupLaunch.vue'
import GroupRequestCard from '@/components/chat/GroupRequestCard.vue'
import { toChat } from '@/utils/chat'
import { useChatStore, useUserStore } from '@/store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const chatStore = useChatStore()

interface IItem {
  group_name: string
  creator_id: number
}

const isShowCreateGroupBox = ref<boolean>(false)
const keywords = ref<string>('')
const items = ref<IItem[]>([])

const params = reactive({
  isShow: false,
  id: 0
})

const tabIndex = ref<string>('all')

const { uid } = userStore

const filterCreator = computed(() => {
  return items.value.filter((item: IItem) => item.creator_id == uid)
})

const filter: any = computed(() => {
  return items.value.filter((item: IItem) => {
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
  getGroupListApi().then(({ code, data }: any) => {
    if (code == 200) {
      items.value = data.items || []
    }
  })
}

const onShowGroup = (item: any) => {
  params.isShow = true
  params.id = item.id
}

const onToChat = (item: any) => toChat(2, item.id)

const onGroupCallBack = () => {
  isShowCreateGroupBox.value = false
  onLoadData()
  chatStore.loadList()
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
          :placeholder="t('search')"
        />
        <el-button
          :icon="Plus"
          @click="isShowCreateGroupBox = true"
        />
      </el-space>
    </el-header>
    <el-main class="scrollbar p-10">
      <div
        v-if="filter.length == 0"
        class="empty"
      >
        {{ t('nothingFound') }}
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
        @chat="onToChat(item)"
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
      @to-chat="
        () => {
          toChat(2, params.id)
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
