<script lang="ts" setup>
import { useUploadsStore } from '@/store/uploads'
import { fileFormatSize } from '@/utils/strings'
import { CloseBold } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const uploadsStore = useUploadsStore()

const { t } = useI18n()

const statusItem = {
  0: t('waitingForLoad'),
  1: t('loading'),
  2: t('loadComplete'),
  3: t('networkError')
}
</script>

<template>
  <div class="section">
    <div class="title">
      <span>
        {{ t('downloads') }}
      </span>
      <!--      <span>-->
      <!--        ({{ uploadsStore.successCount + '/' + uploadsStore.items.length}})-->
      <!--      </span>-->
      <el-button
        :icon="CloseBold"
        link
        @click="uploadsStore.close()"
      />
    </div>
    <div
      v-for="item in uploadsStore.items"
      :key="item.upload_id"
      class="file-item"
    >
      <!--      <div class="file-header">-->
      <!--        <div class="type-icon flex-center">-->
      <!--          {{ item.username.substr(0, 1) }}-->
      <!--        </div>-->
      <!--        <div class="filename">-->
      <!--          {{ item.username }}-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="file-mian">
        <div class="progress flex-center">
          <el-progress
            :percentage="item.percentage"
          />
        </div>
        <div class="detail">
          <p class="info">
            <span class="name">{{ item.file.name }}</span>
            <span class="size">({{ fileFormatSize(item.file.size) }})</span>
          </p>

          <!--          <p>-->
          <!--            <span>{{ item.file.type || 'text' }}</span>-->
          <!--          </p>-->
          <p>{{ statusItem[item.status] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section {
  height: 100%;
  width: 100%;

  .title {
    /* height: 50px; */
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    padding-bottom: 10px;
    /* background-color: #fafafa; */
    border-bottom: 1px solid var(--el-border-color);
  }

  .file-item {

    height: 60px;
    background-color: white;
    display: flex;
    flex-direction: column;
    margin: 15px auto;
    overflow: hidden;
    border: 1px solid #f1eaea;
    border-radius: 5px;

    //.file-header {
    //  height: 45px;
    //  display: flex;
    //  flex-direction: row;
    //  align-items: center;
    //  position: relative;
    //  border-bottom: 1px solid #f7f4f4;
    //
    //  .type-icon {
    //    height: 30px;
    //    width: 30px;
    //    background-color: #2F80ED;
    //    border-radius: 50%;
    //    margin-left: 5px;
    //    font-size: 10px;
    //    font-weight: 200;
    //    overflow: hidden;
    //    color: white;
    //  }
    //
    //  .filename {
    //    margin-left: 10px;
    //    font-size: 14px;
    //    width: 65%;
    //    overflow: hidden;
    //    text-overflow: ellipsis;
    //    white-space: nowrap;
    //  }
    //
    //}

    .file-mian {
      padding: 8px;
      display: flex;
      flex-direction: row;

      .progress {
        width: 45px;
        height: 45px;
        flex-shrink: 0;
        border: 1px solid #f1eaea;
        border-radius: 5px;
      }

      .detail {
        flex: auto;
        /* flex-shrink: 0; */
        /* display: flex; */
        /* flex-direction: column; */
        margin-left: 10px;
        /* justify-content: center; */
        /* align-items: flex-start; */
        font-size: 13px;

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

          .size {
            font-size: 12px;
            color: #cac6c6;
          }
        }

        //p {
        //  margin: 3px;
        //  color: #ada8a8;
        //
        //  span {
        //    color: #595a5a;
        //    font-weight: 500;
        //  }
        //}
      }
    }
  }
}

</style>
