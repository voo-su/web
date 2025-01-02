<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { ChatRound } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="greeting flex-center">
    <div class="content">
      <el-icon :size="50">
        <chat-round />
      </el-icon>
      <p>{{ t('selectChat') }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.greeting {
  height: 100%;
  width: 100%;

  .content {
    text-align: center;
    color: #ccc;
    font-size: 18px;
    font-weight: 300;
  }
}
</style>
