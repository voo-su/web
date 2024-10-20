<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { createGroupRequestsApi } from '@/api/group-chat'
import { searchGroupsApi } from '@/api/search'
import GroupRequestCard from '@/components/message/group/GroupRequestCard.vue'
import { Fold, Search } from '@element-plus/icons-vue'
import { debounce } from '@/utils/common'
import { toDialog } from '@/utils/dialog'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ElMessage } from 'element-plus'
import AppPageHeader from '@/components/app/AppPageHeader.vue'

const emit = defineEmits(['join'])

const loading = ref<boolean>(false)

const search = reactive({
  page: 1,
  next: false,
  name: '',
  loading: false
})

interface IItem {
  id: number
  avatar: string
  count: number
  created_at: string
  description: string
  is_member: boolean
  max_num: number
  name: string
  type: number
}

const items = ref<IItem[]>([])

const onLoadData = () => {
  if (search.loading) return
  search.loading = true
  searchGroupsApi({
    page: search.page,
    name: search.name
  }).then((res: any) => {
    const { code, data } = res
    if (code == 200) {
      let list: any = data.items || []
      if (search.page == 1) {
        items.value = list
      } else {
        items.value.push(...list)
      }
      search.next = data.next
    }
  }).finally(() => {
    search.loading = false
  })
}

const onLoadMore = () => {
  search.page++
  onLoadData()
}

const onSearchInput = debounce((value: any) => {
  search.page = 1
  search.name = value
  onLoadData()
}, 300)

const onToDialog = (item: any) => {
  toDialog(2, item.id)
}

const onJoin = (item: any) => {
  loading.value = true
  createGroupRequestsApi({
    group_id: item.id
  })
    .then((res: any) => {
      const { code } = res
      if (code == 200) {
        ElMessage.success('Заявка на вступление в группу успешно отправлена')
      } else {
        ElMessage.warning(res.message)
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const onInfo = (item: any) => {

}

onLoadData()
</script>

<template>
  <default-layout :index="2">
    <el-container class="is-vertical h-100">
      <app-page-header>
        <template #center>
          <el-input
            :on-input="onSearchInput"
            :prefix-icon="Search"
            placeholder="Поиск"
          />
        </template>
      </app-page-header>
      <el-main class="scrollbar p-10">
        <div
          v-if="items.length == 0"
          class="empty"
        >
          Ничего не найдено.
        </div>
        <div v-else class="items">
          <group-request-card
            v-for="item in items"
            :avatar="item.avatar"
            :flag="item.count + '/' + item.max_num"
            :is-member="false"
            :about="item.description"
            :name="item.name"
            @click="onInfo(item)"
            @dialog="onToDialog(item)"
            @join="onJoin(item)"
          />
        </div>
        <div
          v-show="search.next"
          class="flex-center more"
          @click="onLoadMore"
        >
          <el-icon @click.stop="emit('join')">
            <fold />
            Еще
          </el-icon>
        </div>
      </el-main>
    </el-container>
  </default-layout>
</template>

<style lang="scss" scoped>
.el-container{
  background: #FFFFFF;
  border-radius: 16px;
}

.el-main{
  margin: 10px;

  .items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    grid-gap: 12px;
    gap: 12px;
  }

  .more {
    margin-top: 10px;
    border: 1px solid #cccccc;
    border-radius: 10px;
    cursor: pointer;
    min-height: 40px;

    &:hover {
      border-color: rgb(80 138 254);
    }
  }
}
</style>
