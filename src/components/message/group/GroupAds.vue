<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { reactive, ref } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import Loading from '@/components/base/BaseLoading.vue'
import { getGroupAdsApi } from '@/api/group-chat'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  groupId: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['close'])

const { t } = useI18n()
const isShow = ref<boolean>(true)
const title = ref<string>(t('groupAnnouncement'))

const state = reactive<any>({
  loading: false,
  items: []
})

const onCloseClick = () => {
  emit('close')
}

const onLoadData = () => {
  state.loading = true
  getGroupAdsApi({
    group_id: props.groupId
  })
    .then((res: any) => {
      const { code } = res
      if (code == 200) {
        let items = res.data.items || []
        items.forEach((item: any) => {
          item.isShow = false
        })
        state.items = items
        title.value = t('groupAnnouncementCount', { length:state.items.length })
      }
      state.loading = false
    })
}

onLoadData()
</script>

<template>
  <el-dialog
    v-model="isShow"
    :before-close="onCloseClick"
    :title="title"
    width="50%"
  >
    <div
      v-if="state.loading"
      class="main-box flex-center"
    >
      <loading />
    </div>
    <div v-else-if="state.items.length === 0">
      <div class="empty">
        {{ t('nothingFound') }}
      </div>
    </div>
    <div
      v-else
      class="main-box scrollbar"
    >
      <div
        v-for="item in state.items"
        :key="item.id"
        class="items"
      >
        <div class="title text-ellipsis">
          {{ item.title }}
        </div>
        <div class="description">
          <el-avatar
            :size="18"
            :src="item.avatar"
          />
          <span class="username text-ellipsis">{{ item.username }}</span>
          <span class="datetime">{{ t('publishedAt', { created_at:item.created_at }) }}</span>
          <span
            class="btn"
            @click="item.isShow = !item.isShow"
          >
            <el-icon :size="20">
              <component :is="item.isShow ? ArrowUp : ArrowDown" />
            </el-icon>
            {{ item.isShow ? t('collapse') : t('expand') }}
          </span>
        </div>
        <div
          v-show="item.isShow"
          class="detail"
        >
          {{ item.content }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.main-box {
  height: 500px;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;

  .items {
    min-height: 80px;
    width: 100%;
    margin-bottom: 15px;
    border-bottom: 1px solid #f5eded;

    .title {
      height: 30px;
      line-height: 30px;
      font-size: 15px;
    }

    .description {
      height: 30px;
      line-height: 30px;
      margin-top: 5px;
      display: flex;
      align-items: center;
      position: relative;

      .username {
        margin-left: 8px;
        color: #2196f3;
        font-weight: 400;
        font-size: 13px;
        max-width: 100px;
        cursor: pointer;
      }

      .datetime {
        margin-left: 10px;
        font-size: 12px;
        color: #a59696;
        font-weight: 300;
      }

      .btn {
        position: absolute;
        right: 0;
        bottom: 0;
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        font-size: 13px;
      }
    }

    .detail {
      min-height: 30px;
      width: 100%;
      margin: 15px 0;

      span {
        color: #887f7f;
      }
    }
  }
}
</style>
