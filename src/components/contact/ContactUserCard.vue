<script lang="ts" setup>
// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { computed, reactive, ref, markRaw } from 'vue'
import {
  contactFolderMoveApi,
  createContactApi,
  searchUserApi,
  contactFoldersApi,
  deleteContactApi
} from '@/api/contact'
import { ElMessageBox } from 'element-plus'
import { onSetDisturb, toDialog } from '@/utils/chat'
import {
  Bell,
  Close as CloseIcon,
  Plus as IconPlus,
  Promotion as IconPromotion,
  Delete as IconDelete
} from '@element-plus/icons-vue'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import { useDialogStore, useDialogueStore } from '@/store'
import type { Action } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()

const dialogStore = useDialogStore()
const dialogueStore = useDialogueStore()
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
  // remark: string
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
  // remark: '',
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

const dialogue: any = dialogStore.findItem(dialogueStore.index_name)

if (dialogueStore.index_name !== null) {
  isNotification.value = dialogue.is_disturb == 0
}

const onLoadData = () => {
  searchUserApi({
    user_id: props.uid
  }).then(({ code, data }: any) => {
    if (code == 200) {
      Object.assign(state, data)
      showModal.value = true
    } else {
      ElMessage.info(t('userInfoNotFound'))
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

const onToDialog = () => {
  toDialog(1, props.uid)
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
      ElMessage.success(t('requestSent'))
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
//       ElMessage.success(t('success'))
//     } else {
//       message().error(message)
//     }
//   })
// }

const onNotification = (value: any) => {
  onSetDisturb({
    dialog_type: dialogueStore.dialog.dialog_type,
    receiver_id: dialogueStore.dialog.receiver_id,
    is_disturb: dialogue.is_disturb,
    index_name: dialogueStore.index_name
  })
  isNotification.value = value
}

const onDeleteContact = () => {
  ElMessageBox.confirm(
    t('confirmDeleteContact'),
    t('deleteContactConfirmation', { name: state.username || state.name }),
    {
   //   type: 'warning',
      icon: markRaw(IconDelete),
      confirmButtonText: t('delete'),
      cancelButtonText: t('cancelAction'),
      callback: (action: Action) => {
        if (action == 'confirm') {
          deleteContactApi({
            friend_id: state.id
          }).then((res: any) => {
            const { code, message } = res
            if (code == 200) {
              ElMessage.success(t('contactDeleted'))
              // onDeleteDialog(data.index_name)
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
          <span class="name">{{ t('username') }}</span>
          <span class="text">{{ state.username }}</span>
        </div>
        <div
          v-if="state.name.trim().length !== 0"
          class="info-item"
        >
          <span class="name">{{ t('name') }}</span>
          <span class="text">{{ state.name }}</span>
        </div>
        <div
          v-if="state.surname.trim().length !== 0"
          class="info-item"
        >
          <span class="name">{{ t('surname') }}</span>
          <span class="text">{{ state.surname }}</span>
        </div>
        <div
          v-if="state.gender !== 0"
          class="info-item"
        >
          <span class="name">{{ t('gender') }}</span>
          <span class="text">
            {{ state.gender === 1 ? t('male') : state.gender === 2 ? t('female') : '' }}
          </span>
        </div>
        <div
          v-if="state.about"
          class="info-item"
        >
          <span class="name">{{ t('about') }}</span>
          <span class="text">{{ state.about || '-' }}</span>
        </div>
      </template>
<!--      <div-->
<!--        v-if="folders.length >= 1"-->
<!--        class="info-item"-->
<!--      >-->
<!--        <span class="name">{{ t('folder') }}</span>-->
<!--        <span class="text">{{ groupName }}</span>-->
<!--      </div>-->
      <div
        v-if="state.friend_status === 2 && dialogueStore.index_name !== null"
        class="info-item notif right"
      >
        <el-icon :size="18">
          <bell />
        </el-icon>
        <span class="label">{{ t('notifications') }}</span>
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
            @click="onToDialog"
            class="w-100"
          >
            {{ t('sendMessage') }}
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
            {{ t('deleteContact') }}
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
            {{ t('addToContacts') }}
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
