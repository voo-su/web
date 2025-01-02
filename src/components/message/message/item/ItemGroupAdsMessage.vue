<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { ref } from 'vue'
import type { IGroupAdsExtra } from './types'
import { WindPower } from '@element-plus/icons-vue'

defineProps<{
  extra: IGroupAdsExtra
  data: any
  maxWidth: Boolean
}>()

let show = ref<boolean>(false)
</script>

<template>
  <section
    class="group-ads-message"
    @click="show = !show"
  >
    <div class="title">
      <el-tag
        size="small"
        type="info"
      >
        <el-icon>
          <WindPower />
        </el-icon>
      </el-tag>
      {{ extra.title }}
    </div>
    <div
      class="content"
      :class="{ ellipsis: !show }"
    >
      {{ extra.content }}
    </div>
  </section>
</template>

<style lang="scss" scoped>
.group-ads-message {
  max-width: 500px;
  min-height: 50px;
  border-radius: 10px;
  padding: 8px 10px;
  border: 1px solid rgb(239 239 245);
  user-select: none;
  background-color: #ffffff;
  margin: 0 auto;
  cursor: pointer;

  .title {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #0d1a26;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    margin-bottom: 5px;
  }

  .content {
    font-size: 13px;
    color: #a8a8a8;
    line-height: 24px;
    white-space: pre-wrap;

    &.ellipsis {
      height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
