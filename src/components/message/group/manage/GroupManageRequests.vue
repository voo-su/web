<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { computed, ref } from 'vue'
import { Check, Close, Refresh, Search } from '@element-plus/icons-vue'
import { agreeGroupApplyApi, deleteGroupApplyApi, getGroupRequestsApi } from '@/api/group-chat'
import { ElMessage } from 'element-plus'

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const keywords = ref<string>('')
const batchDelete = ref<any>(false)
const items = ref<any>([])

const filterSearch: any = computed(() => {
  if (!keywords.value.length) {
    return items.value
  }

  return items.value.filter((item: any) => {
    return item.username.match(keywords.value) != null
  })
})

const onLoadData = () => {
  getGroupRequestsApi({
    group_id: props.id
  })
    .then((res: any) => {
      const { code, data } = res
      if (code == 200) {
        items.value = data.items || []
      }
    })
}

const onRowClick = () => {
  if (batchDelete.value == true) {
  } else {
  }
}

const onAgree = (item: any) => {
  agreeGroupApplyApi({
    apply_id: item.id
  })
    .then((res: any) => {
      const { code, message } = res
      if (code == 200) {
        onLoadData()
      } else {
        ElMessage.info(message)
      }
    })
}

const onDelete = (item: any) => {
  deleteGroupApplyApi({
    apply_id: item.id
  })
    .then((res: any) => {
      const { code, message } = res
      if (code == 200) {
        onLoadData()
      } else {
        ElMessage.info(message)
      }
    })
}

onLoadData()
</script>

<template>
  <el-container class="section is-vertical h-100">
    <el-header class="header">
      <p>Заявки ({{ filterSearch.length }})</p>
      <div>
        <el-space>
          <el-input
            v-model="keywords"
            :prefix-icon="Search"
            placeholder="Поиск"
          />
          <el-button
            :icon="Refresh"
            @click="onLoadData"
          />
        </el-space>
      </div>
    </el-header>
    <el-main class="items scrollbar">
      <div
        v-if="filterSearch.length === 0"
        class="empty"
      >
        Ничего не найдено.
      </div>
      <div
        v-else
        v-for="item in filterSearch"
        class="item-card"
        @click="onRowClick(item)"
      >
        <div class="content hidden">
          <div class="item-title">
            <p class="username text-ellipsis">
              <span>{{ item.username }}</span>
              <span class="date ml-15">{{ item.created_at }}</span>
            </p>
          </div>
        </div>
        <div class="tool flex-center">
          <el-space>
            <el-button
              :icon="Check"
              type="info"
              @click="onAgree(item)"
            />
            <el-button
              :icon="Close"
              @click="onDelete(item)"
            />
          </el-space>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--el-border-color);
}

.el-main {
  height: 406px;
}

.items {
  padding: 5px;

  .item-card {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    margin: 15px 0;
    user-select: none;
    padding: 5px 0;

    .content {
      width: 100%;
      height: inherit;
      cursor: pointer;

      .item-title {
        height: 30px;
        width: inherit;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .date {
          color: #989898;
          font-size: 12px;
        }
      }

      .item-text {
        width: inherit;
        height: 20px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }

    .tool {
      width: 100px;
      height: inherit;
      flex-shrink: 0;
      margin-left: 15px;
    }
  }
}
</style>
