<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { contactFolderMoveApi, createContactApi, searchUserApi, contactFoldersApi} from '@/api/contact'
import { onSetDisturb, toDialog } from '@/utils/dialog'
import { message } from '@/utils/util'
import { Bell, Close as CloseIcon, Plus, Promotion } from '@element-plus/icons-vue'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import { useDialogStore, useDialogueStore } from '@/store'

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

const dialogStore = useDialogStore()
const dialogueStore = useDialogueStore()

const isNotification = ref(true)
const showModal = ref(false)
const state = reactive({
  id: 0,
  avatar: '',
  gender: 0,
  about: '',
  username: '',
  // remark: '',
  status: 1,
  text: '',
  is_bot: 0,
  group_id: 0
})

const folders = reactive([])

const groupName = computed(() => {
  const item = folders.find(item => {
    return item.key == state.group_id
  })

  if (item) {
    return item.label
  }

  return 'Папка не установлена'
})

const dialogue = dialogStore.findItem(dialogueStore.index_name)

if (dialogueStore.index_name !== null) {
  isNotification.value = dialogue.is_disturb == 0
}

const onLoadData = () => {
  searchUserApi({
    user_id: props.uid
  }).then(({
             code,
             data
           }) => {
    if (code == 200) {
      Object.assign(state, data)
      showModal.value = true
    } else {
      window['$message'].info('Информация о пользователе не существует')
    }
  })
  contactFoldersApi().then(res => {
    if (res.code == 200) {
      let items = res.data.items || []
      for (const iter of items) {
        folders.push({
          label: iter.name,
          key: iter.id
        })
      }
    }
  })
}

const onToDialog = () => {
  toDialog(1, props.uid)
  props.remove()
  emit('close')
}

const onJoinContact = () => {
  // if (!state.text.length) {
  //   return window['$message'].info('Поле примечания не может быть пустым')
  // }
  createContactApi({
    friend_id: parseInt(props.uid)
    // remark: state.text
  })
    .then((res: any) => {
      const { code, message } = res
    if (code == 200) {
      emit('close')
      onClose()
      window['$message'].success('Заявка успешно отправлена')
    } else {
      window['$message'].error(message)
    }
  })
}

onLoadData()


const onNotification = value => {
  onSetDisturb({
    dialog_type: dialogueStore.dialog.dialog_type,
    receiver_id: dialogueStore.dialog.receiver_id,
    is_disturb: dialogue.is_disturb,
    index_name: dialogueStore.index_name
  })
  isNotification.value = value
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
<!--    {{groupName}}-->
    <el-main>
      <div
        v-if="state.is_bot === 1"
        class="info-item t-center"
      >
        <span class="text">{{ state.name }}</span>
      </div>
      <template v-if="state.is_bot === 0">
        <div class="info-item">
          <span class="name">Имя пользователя</span>
          <span class="text">{{ state.username }}</span>
        </div>
        <div
          v-if="state.name.trim().length !== 0"
          class="info-item"
        >
          <span class="name">Имя</span>
          <span class="text">{{ state.name }}</span>
        </div>
        <div
          v-if="state.surname.trim().length !== 0"
          class="info-item"
        >
          <span class="name">Фамилия</span>
          <span class="text">{{ state.surname }}</span>
        </div>
        <div
          v-if="state.gender !== 0"
          class="info-item"
        >
          <span class="name">Пол</span>
          <span class="text">
            {{ state.gender == 1 ? 'муж' : state.gender == 2 ? 'жен' : '' }}
          </span>
        </div>
        <div
          v-if="state.about"
          class="info-item"
        >
          <span class="name">О себе</span>
          <span class="text">{{ state.about || '-' }}</span>
        </div>
      </template>
      <div
        v-if="state.friend_status == 2 && dialogueStore.index_name !== null"
        class="info-item notif right"
      >
        <el-icon :size="18">
          <bell />
        </el-icon>
        <span class="label">Уведомления</span>
        <span class="text">
          <el-switch
            v-model="isNotification"
            @change="onNotification"
          />
        </span>
      </div>
    </el-main>
    <el-footer
      v-if="state.is_bot === 0"
      class="flex-center"
    >
      <template v-if="state.friend_status == 2">
        <el-button
          type="primary"
          text
          @click="onToDialog"
        >
          <template #icon>
            <el-icon>
              <promotion />
            </el-icon>
          </template>
          Отправить сообщение
        </el-button>
      </template>
      <template v-else-if="state.friend_status == 1">
        <el-button
          type="primary"
          @click="onJoinContact"
        >
          <template #icon>
            <el-icon>
              <plus />
            </el-icon>
          </template>
          Добавить в контакты
        </el-button>
      </template>
    </el-footer>
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

.el-footer {
  height: 60px;
  padding: 0 15px;
  border-top: 1px solid var(--el-border-color);
}
</style>
