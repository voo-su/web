<script lang="ts" setup>
import { computed, reactive, ref, markRaw } from 'vue'
import {
  contactFolderMoveApi,
  createContactApi,
  searchUserApi,
  contactFoldersApi,
  deleteContactApi
} from '@/api/contact'
import { ElMessageBox } from 'element-plus'
import { onSetDisturb, toChat } from '@/utils/chat'
import {
  Bell,
  Close as CloseIcon,
  Plus as IconPlus,
  Promotion as IconPromotion,
  Delete as IconDelete
} from '@element-plus/icons-vue'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import { useChatStore, useMessageStore } from '@/store'
import type { Action } from 'element-plus'
import { ElMessage } from 'element-plus'
import { i18n } from '@/utils/i18n'

const props = defineProps({
  uid: {
    type: Number,
    default: 0
  },
  remove: {
    type: Function,
    default: () => {
    }
  }
})

const emit = defineEmits(['close', 'event'])

const chatStore = useChatStore()
const messageStore = useMessageStore()
const isNotification = ref<boolean>(true)
const showModal = ref<boolean>(false)

interface IContact {
  id: number
  username: string
  name: string
  surname: string
  gender: number
  avatar: string
  about: string
  friend_status: number
  text: string
  is_bot: number
  folder_id: number
}

const state = reactive<IContact>({
  id: 0,
  username: '',
  name: '',
  surname: '',
  gender: 0,
  avatar: '',
  about: '',
  friend_status: 1,
  text: '',
  is_bot: 0,
  folder_id: 0
})

// interface IFolder {
//   key: number
//   label: string
// }
//
// const folders = reactive<IFolder[]>([])
//
// const groupName = computed(() => {
//   const item = folders.find((item: IFolder) => {
//     return item.key == state.folder_id
//   })
//
//   if (item) {
//     return item.label
//   }
//
//   return ''
// })

const chat: any = chatStore.findItem(messageStore.index_name)

if (messageStore.index_name !== null) {
  isNotification.value = chat.is_disturb == 0
}

const onLoadData = () => {
  searchUserApi({
    user_id: props.uid
  }).then(({ code, data }: any) => {
    if (code == 200) {
      Object.assign(state, data)
      showModal.value = true
    } else {
      ElMessage.info(i18n('userInfoNotFound'))
    }
  })

  // contactFoldersApi()
  //   .then(({ code, data }: any) => {
  //   if (code == 200) {
  //     let items = data.items || []
  //     for (const iter of items) {
  //       folders.push({
  //         label: iter.name,
  //         key: iter.id
  //       })
  //     }
  //   }
  // })
}

const onToChat = () => {
  toChat(1, props.uid)
  props.remove()
  emit('close')
}

const onJoinContact = () => {
  createContactApi({
    friend_id: props.uid
  })
    .then(({ code, message }: any) => {
    if (code == 200) {
      emit('close')
      onClose()
      ElMessage.success(i18n('requestSent'))
    } else {
      ElMessage.error(message)
    }
  })
}

// const handleSelectFolder = (value: any) => {
//   contactFolderMoveApi({
//     user_id: props.uid,
//     folder_id: value
//   })
//     .then(({ code, message }: any) => {
//     if (code == 200) {
//       state.folder_id = value
//       ElMessage.success(i18n('success'))
//     } else {
//       ElMessage.error(message)
//     }
//   })
// }

const onNotification = (value: any) => {
  onSetDisturb({
    chat_type: messageStore.chat.chat_type,
    receiver_id: messageStore.chat.receiver_id,
    is_disturb: chat.is_disturb,
    index_name: messageStore.index_name
  })
  isNotification.value = value
}

const onDeleteContact = () => {
  ElMessageBox.confirm(
    i18n('confirmDeleteContact'),
    i18n('deleteContactConfirmation', { name: state.username || state.name }),
    {
   //   type: 'warning',
      icon: markRaw(IconDelete),
      confirmButtonText: i18n('delete'),
      cancelButtonText: i18n('cancelAction'),
      callback: (action: Action) => {
        if (action == 'confirm') {
          deleteContactApi({
            friend_id: state.id
          }).then(({ code, message }: any) => {
            if (code == 200) {
              ElMessage.success(i18n('contactDeleted'))
              // onChatDelete(data.index_name)
            } else {
              ElMessage.error(message)
            }
          })
        }
      }
    }
  )
}

const onClose = () => {
  showModal.value = false
}

onLoadData()
</script>

<template>
  <el-dialog
    v-model="showModal"
    :before-close="onClose"
    :show-close="false"
    width="500px"
  >
    <template #header="{ close, titleId, titleClass }">
      <el-header>
        <avatar-box
          :avatar="state.avatar"
          :username="state.username"
          :name="state.name"
          :surname="state.surname"
          :size="100"
          viewer
        />
      </el-header>
      <div class="module__after">
        <el-button
          :icon="CloseIcon"
          class="close"
          link
          type="info"
          @click="close"
        />
      </div>
    </template>
    <el-main>
      <div
        v-if="state.is_bot === 1"
        class="info-item t-center"
      >
        <span class="text">{{ state.name }}</span>
      </div>
      <template v-if="state.is_bot === 0">
        <div class="info-item">
          <span class="name">{{ i18n('username') }}</span>
          <span class="text">{{ state.username }}</span>
        </div>
        <div
          v-if="state.name.trim().length !== 0"
          class="info-item"
        >
          <span class="name">{{ i18n('name') }}</span>
          <span class="text">{{ state.name }}</span>
        </div>
        <div
          v-if="state.surname.trim().length !== 0"
          class="info-item"
        >
          <span class="name">{{ i18n('surname') }}</span>
          <span class="text">{{ state.surname }}</span>
        </div>
        <div
          v-if="state.gender !== 0"
          class="info-item"
        >
          <span class="name">{{ i18n('gender') }}</span>
          <span class="text">
            {{ state.gender === 1 ? i18n('male') : state.gender === 2 ? i18n('female') : '' }}
          </span>
        </div>
        <div
          v-if="state.about"
          class="info-item"
        >
          <span class="name">{{ i18n('about') }}</span>
          <span class="text">{{ state.about || '-' }}</span>
        </div>
      </template>
<!--      <div-->
<!--        v-if="folders.length >= 1"-->
<!--        class="info-item"-->
<!--      >-->
<!--        <span class="name">{{ i18n('folder') }}</span>-->
<!--        <span class="text">{{ groupName }}</span>-->
<!--      </div>-->
      <div
        v-if="state.friend_status === 2 && messageStore.index_name !== null"
        class="info-item notif right"
      >
        <el-icon :size="18">
          <bell />
        </el-icon>
        <span class="label">{{ i18n('notifications') }}</span>
        <span class="text">
          <el-switch
            v-model="isNotification"
            @change="onNotification"
          />
        </span>
      </div>
    </el-main>
    <el-row
      v-if="state.is_bot === 0"
      class="footer"
    >
      <template v-if="state.friend_status === 2">
        <el-col>
          <el-button
            type="primary"
            text
            :icon="IconPromotion"
            @click="onToChat"
            class="w-100"
          >
            {{ i18n('sendMessage') }}
          </el-button>
        </el-col>
        <el-col>
          <el-button
            type="danger"
            text
            :icon="IconDelete"
            @click="onDeleteContact"
            class="w-100"
          >
            {{ i18n('deleteContact') }}
          </el-button>
        </el-col>
      </template>
      <template v-else-if="state.friend_status === 1">
        <el-col>
          <el-button
            type="primary"
            :icon="IconPlus"
            @click="onJoinContact"
            class="w-100"
          >
            {{ i18n('addToContacts') }}
          </el-button>
        </el-col>
      </template>
    </el-row>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-header {
  width: 100%;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

  .avatar-box {
    height: 100px;
    width: 100px;
    font-size: 30px;
  }
}

.el-main {
  overflow: unset;
  padding: 8px 0;
  min-height: 40px;

  .info-item {
    flex-grow: 1;
    white-space: initial;
    overflow: hidden;
    padding: 4px 30px 4px 30px;

    .name, .name {
      display: block;
      text-align: initial;
    }

    .name, .label {
      flex-shrink: 0;
      color: #707579;
    }

    .label {
      line-height: 2.0rem;
    }

    .name {
      font-size: .875rem;
      line-height: 1.5rem;
    }

    .text {
      flex: 1 auto;
      color: #000000;
    }

    .el-icon {
      margin: 5px 5px 0 0;
    }

    &.notif {
      margin-top: 8px;
      background: #F4F4F7;
      padding: 5px 30px;
    }

    &.right {
      display: flex;
      border-top: solid 1px var(--el-border-color)6;

      .name {
        line-height: 30px;
      }

      .text {
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}

.footer {
  padding: 5px 15px;
  border-top: 1px solid var(--el-border-color);
}
</style>
