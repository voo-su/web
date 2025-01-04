<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import GroupManageAdsEditor from './GroupManageAdsEditor.vue'
import { getGroupAdsApi } from '@/api/group-chat'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const { t } = useI18n()
const keywords = ref<string>('')
const batchDelete = ref<boolean>(false)
const items = ref<any>([])
const editor = reactive<any>({
  isShow: false,
  id: 0,
  gid: 0,
  title: '',
  content: ''
})

const filterCheck = computed(() => items.value.filter((item: any) => item.is_delete))

const filterSearch: any = computed(() => {
  if (!keywords.value.length) {
    return items.value
  }

  return items.value.filter((item: any) => {
    return item.title.match(keywords.value) != null
  })
})

const onLoadData = () => {
  getGroupAdsApi({
    group_id: props.id
  })
    .then((res: any) => {
      const { code } = res
      if (code == 200) {
        items.value = res.data.items || []
      }
    })
}

const onBatchDelete = () => {
  if (!filterCheck.value.length) {
    return
  }

  let ids = filterCheck.value.map((item: any) => item.user_id).join(',')
}

const onRowClick = (item: any) => {
  if (batchDelete.value == true) {
  } else {
    editor.id = item.id
    editor.gid = props.id
    editor.title = item.title
    editor.content = item.content
    editor.isShow = true
  }
}

const onAdd = () => {
  editor.id = 0
  editor.gid = props.id
  editor.title = ''
  editor.content = ''
  editor.isShow = true
}

const onCancelDelete = () => {
  items.value.forEach((item: any) => {
    item.is_delete = false
  })

  batchDelete.value = false
}

const onEditorSuccess = () => {
  editor.isShow = false
  onLoadData()
}

onLoadData()
</script>

<template>
  <el-container class="section is-vertical h-100">
    <el-header class="header">
      <p>{{ t('announcementsCount', { length:filterSearch.length }) }}</p>
      <div>
        <el-space>
          <el-input
            v-model="keywords"
            :prefix-icon="Search"
            :placeholder="t('search')"
          />
          <el-button
            :icon="Plus"
            @click="onAdd"
          />
        </el-space>
      </div>
    </el-header>
    <el-main class="main">
      <div
        v-if="filterSearch.length === 0"
        class="empty"
      >
        {{ t('nothingFound') }}
      </div>
      <div
        v-else
        v-for="item in filterSearch"
        class="member-item"
        @click="onRowClick(item)"
      >
        <div class="content hidden">
          <div class="item-title">
            <p class="username text-ellipsis">
              <span>{{ item.title }}</span>
            </p>
            <p>
              <span class="date">{{ item.updated_at }}</span>
            </p>
          </div>
          <div class="item-text text-ellipsis">
            {{ item.content }}
          </div>
        </div>
      </div>
    </el-main>
    <el-footer
      v-show="batchDelete"
      class="footer"
    >
      <div class="tips">
        {{ t('selectedCount', { length:filterCheck.length }) }}
      </div>
      <div>
        <el-space>
          <el-button
            size="small"
            type="primary"
            @click="onCancelDelete"
          >
            {{ t('cancelAction') }}
          </el-button>
          <el-button
            size="small"
            type="error"
            @click="onBatchDelete"
          >
            {{ t('delete') }}
          </el-button>
        </el-space>
      </div>
    </el-footer>
  </el-container>
  <group-manage-ads-editor
    v-if="editor.isShow"
    :id="editor.id"
    :content="editor.content"
    :gid="editor.gid"
    :title="editor.title"
    @close="editor.isShow = false"
    @success="onEditorSuccess"
  />
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
  padding: 0 15px;
  box-sizing: border-box;
}

.member-item {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  user-select: none;
  padding: 5px 0 15px 0;
  border-bottom: 1px solid var(--el-border-color);

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
      font-weight: 500;

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

  &:hover {
    .item-title {
      color: #2196f3;
    }
  }
}

.footer {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background-color: #fdf9f9;
  border-bottom-right-radius: 15px;
  border-top: 1px solid var(--el-border-color);

  .tips {
    font-size: 16px;
  }
}
</style>
