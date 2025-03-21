<script lang="ts" setup>
import { computed, inject, reactive, ref, watch } from 'vue'
import { useUserStore } from '@/store/user'
import GroupManage from './group/index.vue'
import { Close as CloseIcon, Plus, Search as SearchIcon } from '@element-plus/icons-vue'
import { getGroupMembersApi, groupDetailApi, leaveGroupApi } from '@/api/group-chat'
import { ElMessageBox } from 'element-plus'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import GroupLaunch from './GroupLaunch.vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()

const props = defineProps({
  gid: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'to-chat'])

const { t } = useI18n()
const user: any = inject('$user')
const activeName = ref<string>('info')
const isShow = ref<boolean>(true)
// const editCardPopover = ref<boolean>(false)
const isShowGroup = ref<boolean>(false)
const isShowManage = ref<boolean>(false)
const state = reactive<any>({
  keywords: '',
  detail: {
    avatar: '',
    name: '',
    description: ''
  },
  members: []
})

const search = computed(() => {
  if (state.keywords) {
    return state.members.filter((item: any) => item.username.match(state.keywords) != null)
  }

  return state.members
})

const isLeader = computed(() => {
  return state.members.some((item: any) => {
    return item.user_id == userStore.uid && item.leader >= 1
  })
})

const isAdmin = computed(() => {
  return state.members.some((item: any) => {
    return item.user_id == userStore.uid && item.leader == 2
  })
})

const onGroupCallBack = () => {
}

const onToInfo = (item: any) => user(item.user_id)

const onClose = () => {
  emit('close')
}

const loadDetail = () => {
  groupDetailApi({ group_id: props.gid })
    .then(({ code, data }: any) => {
      if (code == 200) {
        let result = data
        state.detail.avatar = result.avatar
        state.detail.name = result.group_name
        state.detail.description = result.description
        if (result.ads) {
          state.detail.group_ads = result.ads
        }
      }
    })
}

const loadMembers = () => {
  getGroupMembersApi({ group_id: props.gid })
    .then(({ code, data }: any) => {
      if (code == 200) {
        state.members = data.items || []
      }
    })
}

const onSignOut = () => {
  ElMessageBox.confirm(
    t('confirmLeaveGroup'),
    t('leaveGroup'),
    {
      confirmButtonText: t('logout'),
      cancelButtonText: t('cancelAction'),
      type: 'warning'
    }
  )
    .then(() => {
      leaveGroupApi({
        group_id: props.gid
      })
        .then(({ code, message }: any) => {
          if (code == 200) {
            ElMessage.success(t('leftGroupSuccess'))
            onClose()
          } else {
            ElMessage.error(message)
          }
        })
    })
    .catch(() => {})
}

watch(props, () => {
  loadDetail()
  loadMembers()
})

loadDetail()
loadMembers()
</script>

<template>
  <el-dialog
    v-model="isShow"
    :before-close="onClose"
    :show-close="false"
    width="390px"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4
        :id="titleId"
        :class="titleClass"
      >
        {{ t('groupInfo') }}
      </h4>
      <div class="module__after">
        <el-button
          type="info"
          class="close"
          link
          :icon="CloseIcon"
          @click="close"
        />
      </div>
    </template>
    <el-tabs v-model="activeName">
      <el-tab-pane
        :label="t('groupInfo')"
        name="info"
      >
        <el-header>
          <avatar-box
            :avatar="state.detail.avatar"
            :username="state.detail.name"
            :size="100"
            viewer
          />
        </el-header>
        <div class="info-box">
          <div class="item-card">
            <div class="block">
              <div class="title">
                {{ t('groupName') }}
              </div>
            </div>
            <div class="description">
              {{ state.detail.name }}
            </div>
          </div>
          <div
            v-if="state.detail.description.length >= 1"
            class="item-card"
          >
            <div class="block">
              <div class="title">
                {{ t('groupDescription') }}
              </div>
            </div>
            <div class="description">
              {{ state.detail.description }}
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="t('groupParticipants')"
        name="member"
      >
        <div class="flex">
          <el-input
            v-model="state.keywords"
            :prefix-icon="SearchIcon"
            :placeholder="t('search')"
          />
          <el-button
            :icon="Plus"
            class="ml-15"
            @click="isShowGroup = true"
          />
        </div>
        <div
          v-if="search.length == 0"
          class="mt-20 pt-20"
        >
          <div class="empty">
            {{ t('nothingFound') }}
          </div>
        </div>
        <div
          v-else
          class="member-box"
        >
          <div
            v-for="item in search"
            :key="item.id"
            class="item-card"
            @click="onToInfo(item)"
          >
            <div class="left-item">
              <avatar-box
                :avatar="item.avatar"
                :username="item.username"
                :name="item.name"
                :surname="item.surname"
                class="avatar"
                :size="25"
              />
            </div>
            <div class="right-item">
              <div class="item-title">
                <span class="username text-ellipsis">{{ item.username ? item.username : '-' }}</span>
                <span
                  v-if="item.leader === 2"
                  class="member-type"
                >{{ t('owner') }}</span>
                <span
                  v-if="item.leader === 1"
                  class="member-type"
                >{{ t('admin') }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-footer class="footer">
      <el-button
        v-if="!isAdmin"
        type="danger"
        link
        @click="onSignOut"
      >
        {{ t('logout') }}
      </el-button>
      <el-button
        v-if="isLeader"
        link
        type="primary"
        @click="isShowManage = true"
      >
        {{ t('groupManagement') }}
      </el-button>
    </el-footer>
  </el-dialog>
  <group-launch
    v-model="isShowGroup"
    :gid="gid"
    @close="isShowGroup = false"
    @on-submit="onGroupCallBack"
  />
  <group-manage
    v-if="isShowManage"
    :gid="gid"
    @close="isShowManage = false"
  />
</template>

<style lang="scss" scoped>
.el-main {
  padding: 0 15px;

  .el-header {
    width: 100%;
    height: 100px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-box {
      height: 100px;
      width: 100px;
      font-size: 30px;
    }
  }

  .info-box {
    .item-card {
      display: flex;
      align-items: center;
      min-height: 30px;
      margin: 12px 0;
      flex-direction: column;
      cursor: pointer;

      &:first-child {
        margin-top: 0;
      }

      .block {
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
          height: 100%;
          line-height: 30px;
          flex: auto;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .text {
          height: 100%;
          line-height: 30px;
          width: 30%;
          text-align: right;
        }
      }

      .description {
        width: 100%;
        min-height: 24px;
        line-height: 24px;
        font-size: 13px;
        color: #b1b1b1;
        font-weight: 300;
        overflow: hidden;
        word-break: break-word;
      }
    }
  }

  .member-box {
    padding-top: 10px;
    width: 360px;

    .item-card {
      display: flex;
      width: 100%;
      min-height: 10px;
      box-sizing: border-box;

      &:hover {
        color: #ececec;
      }

      .left-item {
        flex-shrink: 0;

        .avatar-box {
          height: 24px;
          width: 24px;
          margin-top: 3px;
        }
      }

      .right-item {
        margin-left: 6px;
        width: 100%;

        .item-title {
          height: 28px;
          width: inherit;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 50px;
  padding: 15px;
  border-top: 1px solid var(--el-border-color);
}
</style>
