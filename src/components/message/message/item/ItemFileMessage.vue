<script lang="ts" setup>
import { fileFormatSize } from '@/utils/strings'
import { download } from '@/utils/functions'
import type { IFileExtra } from './types'
import { Download } from '@element-plus/icons-vue'
import TextMessage from './ItemTextMessage.vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  extra: IFileExtra
  data: any
  maxWidth: Boolean
}>()

const { t } = useI18n()
</script>

<template>

  <section class="file-message">
    <div class="main">
      <div class="ext">
        {{ extra.suffix }}
      </div>
      <div class="file-box">
        <p class="info">
          <span class="name">{{ extra.name }}</span>
        </p>
        <el-button
          type="primary"
          link
          size="small"
          :icon="Download"
          @click="download(data.id)"
        >
          <span class="size">{{ t('download') }} ({{ fileFormatSize(extra.size) }})</span>
        </el-button>
      </div>
    </div>
    <text-message
      v-if="data.content"
      :data="data"
      :extra="extra"
    />
  </section>
</template>

<style lang="scss" scoped>
.file-message {
  width: 250px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgb(239 239 245);

  .main {
    height: 45px;
    display: flex;
    flex-direction: row;

    .ext {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 45px;
      height: 45px;
      color: #606266;
      border-radius: 5px;
      font-size: 12px;
      border: 1px solid #f1eaea;
    }

    .file-box {
      flex: 1 1;
      height: 45px;
      margin-left: 10px;
      overflow: hidden;

      a {
        cursor: pointer;
        .size {
          font-size: 12px;
          color: #cac6c6;
        }
      }

      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        height: 24px;
        color: rgb(76, 76, 76);
        font-size: 14px;

        .name {
          flex: 1 auto;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

      }
    }
  }
}
</style>
