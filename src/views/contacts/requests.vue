<script lang="ts" setup>
import { inject, ref } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
import { applyAcceptApi, applyDeclineApi, getContactApplyMessagesApi } from '@/api/contact'
import { useUserStore } from '@/store/user'
import AppPageHeader from '@/components/app/AppPageHeader.vue'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import { throttle } from '@/utils/common'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ContactTopMenu from '@/components/contact/ContactTopMenu.vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close'])

const { t } = useI18n()
const user: any = inject('$user')
const userStore = useUserStore()
const loadingAccept = ref<boolean>(false)
const loadingDecline = ref<boolean>(false)
const items = ref<any>([])

const onLoadData = () => {
  getContactApplyMessagesApi().then(({ code, data }: any) => {
    if (code == 200) {
      items.value = data.items || []
      userStore.isContactApply = false
    }
  })
}

const onInfo = (item: any) => user(item.user_id)

const onAccept = throttle((item: any) => {
  loadingAccept.value = true
  applyAcceptApi({
    apply_id: item.id
  }).then(({ code, message }: any) => {
    if (code == 200) {
      onLoadData()
      ElMessage.success(t('requestAccepted'))
    } else {
      ElMessage.info(message)
    }
  }).finally(() => {
    loadingAccept.value = false
  })
}, 1000)

const onDecline = throttle((item: any) => {
  loadingDecline.value = true
  applyDeclineApi({
    apply_id: item.id
  }).then(({ code, message }: any) => {
    loadingAccept.value = false
    if (code == 200) {
      onLoadData()
      ElMessage.success(t('requestRejected'))
    } else {
      ElMessage.info(message)
    }
  }).finally(() => {
    loadingAccept.value = false
  })
}, 1000)

onLoadData()
</script>

<template>
  <default-layout :index="1">
    <el-container class="is-vertical h-100">
      <app-page-header>
        <template #content>
          {{ t('requestList') }}
        </template>
      </app-page-header>
      <contact-top-menu />
      <el-main v-if="items.length === 0">
        <div class="empty">
          {{ t('nothingFound') }}
        </div>
      </el-main>
      <el-main
        v-else
        class="section scrollbar"
      >
        <div
          v-for="item in items"
          :key="item.id"
          class="item-card"
        >
          <div class="left-item">
            <avatar-box
              :avatar="item.avatar"
              :name="item.name"
              :surname="item.surname"
              :username="item.username"
            />
          </div>
          <div
            class="content hidden"
            @click="onInfo(item)"
          >
            <div class="username">
              <span>{{ item.username }}</span>
            </div>
            <div class="name text-ellipsis">
              {{ item.name }} {{ item.surname }}
            </div>
          </div>
          <div class="tools">
            <el-button
              :icon="Check"
              :loading="loadingAccept"
              bg
              text
              type="primary"
              @click="onAccept(item)"
            >
              {{ t('accept') }}
            </el-button>
            <el-button
              :icon="Close"
              :loading="loadingDecline"
              bg
              text
              type="danger"
              @click="onDecline(item)"
            >
              {{ t('reject') }}
            </el-button>
          </div>
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

.section {
  width: 100%;
  overflow-y: auto;

  .item-card {
    width: inherit;
    height: 50px;
    margin: 15px 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 15px;

    .left-item {
      width: 50px;
      flex-shrink: 0;
    }

    .content {
      height: inherit;
      width: 100%;
      cursor: pointer;

      .username {
        height: 25px;
        line-height: 25px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .name {
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        color: #9a9292;
        overflow: hidden;
        width: inherit;
      }
    }

    .tools {
      height: inherit;
      display: flex;

      .el-button {
        height: 32px;
      }
    }
  }
}
</style>
