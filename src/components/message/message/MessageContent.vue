<script lang="ts" setup>
import { computed, inject, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { Loading as IconLoading } from '@element-plus/icons-vue'
import CircleScrollDown from '../CircleScrollDown.vue'
import socket from '@/utils/socket'
import { useDialogueStore } from '@/store'
import { formatTime, parseTime } from '@/utils/datetime'
import { clipboard, clipboardImage, htmlDecode } from '@/utils/common'
import { addClass, removeClass } from '@/utils/dom'
import { downloadImage } from '@/utils/functions'
import { formatDialogRecord } from '@/utils/dialog'
import { ForwardableMessageType, MessageComponents } from '@/constants/message'
import { dialogRecordsApi } from '@/api/message'
import { useMenu } from './menu'
import ContextMenu from '@/components/base/BaseContextMenu.vue'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import IconOneCheck from '@/components/icons/IconOneCheck.vue'
import IconTwoCheck from '@/components/icons/IconTwoCheck.vue'
import { publisher } from '@/utils/publisher.ts'
import ItemRevokeMessage from '@/components/message/message/item/ItemRevokeMessage.vue'

const {
  dropdown,
  showDropdownMenu,
  closeDropdownMenu
} = useMenu()
const user: any = inject('$user')
const dialogueStore = useDialogueStore()

const props = defineProps({
  uid: {
    type: Number,
    default: 0
  },
  dialog_type: {
    type: Number,
    default: 0
  },
  receiver_id: {
    type: Number,
    default: 0
  },
  index_name: {
    type: String,
    default: ''
  }
})

const records = computed(() => dialogueStore.records)

const loadConfig = reactive({
  status: 0,
  minRecord: 0
})

const skipBottom = ref(false)

let locationMessage: any = null

const onLoadDialog = () => {
  const data = {
    record_id: loadConfig.minRecord,
    receiver_id: props.receiver_id,
    dialog_type: props.dialog_type,
    limit: 30
  }

  if (locationMessage) {
    data.limit = 100
  }

  let scrollHeight = 0

  let el = document.getElementById('chat-panel')
  if (el) {
    scrollHeight = el.scrollHeight
  }

  loadConfig.status = 0

  dialogRecordsApi(data)
    .then(res => {
      if (
        data.dialog_type != props.dialog_type ||
        data.receiver_id != props.receiver_id
      ) {
        locationMessage = null
        return
      }

      const records = res.data.items || []

      records.map((item: any) => formatDialogRecord(props.uid, item))

      if (data.record_id == 0) {
        dialogueStore.clearDialogueRecord()
      }

      if (props.dialog_type == 1) {
        onAfterRead(records)
      }

      dialogueStore.unshiftDialogueRecord(records.reverse())

      loadConfig.status = records.length >= res.data.limit ? 1 : 2
      loadConfig.minRecord = res.data.record_id

      nextTick(() => {
        if (!el)
          return

        if (data.record_id == 0) {
          el.scrollTop = el.scrollHeight
        } else {
          el.scrollTop = el.scrollHeight - scrollHeight
        }

        if (locationMessage) {
          onJumpMessage(locationMessage.msgid)
        }

      })
    })
    .catch(() => {
      loadConfig.status = 1
    })
}

const onAfterRead = (records: any) => {
  let ids: number[] = []
  for (const record of records) {
    if (props.receiver_id === record.user_id && record.is_read === 0) {
      ids.push(record.id)
    }
  }

  if (ids.length) {
    socket.emit('voo.message.read', {
      receiver_id: props.receiver_id,
      msg_id: ids
    })
  }
}

const isShowDialogTime = (index: number, datetime: string) => {
  if (datetime == undefined) {
    return false
  }

  if (records.value[index].is_revoke == 1) {
    return false
  }

  datetime = datetime.replace(/-/g, '/')

  let time = Math.floor(Date.parse(datetime) / 1000)
  let currTime = Math.floor(new Date().getTime() / 1000)
  if (currTime - time < 300) return false

  if (index == records.value.length - 1) {
    return true
  }

  let nextDate = records.value[index + 1].created_at.replace(/-/g, '/')

  return !(
    parseTime(new Date(datetime), 'h:i d.m.y') ==
    parseTime(new Date(nextDate), 'h:i d.m.y')
  )
}

const onPanelScroll = (e: any) => {
  if (e.target.scrollTop == 0 && loadConfig.status == 1) {
    onLoadDialog()
  }

  const height = e.target.scrollTop + e.target.clientHeight
  skipBottom.value = height < e.target.scrollHeight - 200

  if (!skipBottom.value && dialogueStore.unreadBubble) {
    dialogueStore.setUnreadBubble(0)
  }
}

const onCopyText = (data: any) => {
  if (data.content && data.content.length > 0) {
    return clipboard(htmlDecode(data.content), () => {
    })
  }

  if (data.extra?.url) {
    return clipboardImage(data.extra.url, () => () => {
    })
  }
}

const onDeleteDialog = (data: any) => {
  dialogueStore.ApiDeleteRecord([data.id])
}

const onRevokeDialog = (data: any) => {
  dialogueStore.ApiRevokeRecord(data.msg_id)
}

const onDownloadFile = (data: any) => {
  if (data.msg_type == 3) {
    return downloadImage(data.extra.url, `${data.msg_id}.${data.extra.suffix}`)
  }

  if (data.msg_type == 4) {
    return window['$message'].info('Загрузка аудиофайлов в настоящее время не поддерживается')
  }

  return window['$message'].info('Загрузка видеофайлов в настоящее время не поддерживается')
}

const onQuoteMessage = (data: any) => {
  let item = {
    id: data.msg_id,
    // title: `${data.username} ${data.created_at}`,
    title: `${data.username}`,
    description: '',
    image: ''
  }

  switch (data.msg_type) {
    case 1:
      item.description = data.content
      break
    case 2:
      item.description = 'Сообщение с кодом'
      break
    case 3:
      item.image = data.extra.url
      break
    case 4:
      item.description = 'Аудиозапись'
      break
    case 5:
      item.description = 'Видео'
      break
    case 6:
      item.description = 'Другой тип файла'
      break
    case 7:
      item.description = 'Сообщение о местоположении'
      break
    case 8:
      item.description = 'Сообщение с контактной информацией'
      break
    case 9:
      item.description = 'Пересланное сообщение'
      break
    case 10:
      item.description = 'Сообщение о входе'
      break
    case 11:
      item.description = 'Опрос'
      break
    case 12:
      item.description = 'Изображения'
      break
  }

  publisher.publish('editor:quote', item)
}

const onClickUsername = (data: any) => {
  publisher.publish('editor:mention', {
    id: data.user_id,
    value: data.username
  })
}

const onContextMenu = (e: any, item: any) => {
  if (!dialogueStore.isShowEditor || dialogueStore.isOpenMultiSelect) {
    return e.preventDefault()
  }

  showDropdownMenu(e, props.uid, item)

  e.preventDefault()
}

// const onMultiSelect = (data: any) => {
//   dialogueStore.updateDialogueRecord({
//     id: data.id,
//     isCheck: true
//   })
//
//   dialogueStore.isOpenMultiSelect = true
// }
//
// const onForwardMessage = (data: any) => {
//   console.log(data)
// }

const onContextMenuHandle = (key: string) => {
  const events = {
    copy: onCopyText,
    delete: onDeleteDialog,
    revoke: onRevokeDialog,
    download: onDownloadFile,
    quote: onQuoteMessage
    // forward: onForwardMessage,
    // multiSelect: onMultiSelect
  }
  events[key] && events[key](dropdown.item)
  closeDropdownMenu()
}

const onSkipBottom = () => {
  let el = document.getElementById('chat-panel')
  if (el) {
    el.scrollTo({
      top: el.scrollHeight + 1000,
      behavior: 'smooth'
    })
  }
}

const onJumpMessage = (msgid: string) => {
  let element = document.getElementById(msgid)
  if (!element) {
    if (locationMessage === null) {
      locationMessage = {
        msgid: msgid,
        num: 3
      }
    } else {
      locationMessage.num--

      if (locationMessage.num === 0) {
        locationMessage = null
        window['$message'].info('Только последние 300 записей доступны для просмотра.')
        return
      }
    }

    let el = document.getElementById('chat-panel')
    el?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    return
  }

  locationMessage = null

  element?.scrollIntoView({
    behavior: 'smooth'
  })

  addClass(element, 'border')

  setTimeout(() => {
    removeClass(element, 'border')
  }, 3000)

}

const onReload = () => {
  loadConfig.status = 0
  loadConfig.minRecord = 0
  locationMessage = null
  onLoadDialog()
}

const onRowClick = (item: any) => {
  if (dialogueStore.isOpenMultiSelect) {
    if (ForwardableMessageType.includes(item.msg_type)) {
      item.isCheck = !item.isCheck
    } else {
      window['$message'].info('Этот тип сообщения не поддерживает пересылку')
    }
  }
}

watch(props, onReload)

onMounted(onReload)
</script>

<template>
  <section class="section">
    <div
      id="chat-panel"
      class="scrollbar dialog-container"
      @scroll="onPanelScroll($event)"
    >
      <div class="load">
        <span v-if="loadConfig.status == 0">Загрузка данных...</span>
        <span
          v-else-if="loadConfig.status == 1"
          @click="onLoadDialog"
        >
          Еще
        </span>
      </div>
      <div
        v-for="(item, index) in records"
        :id="item.msg_id"
        :key="item.msg_id"
        class="message-item"
      >
        <div
          v-if="item.msg_type >= 1000"
          class="message-box"
        >
          <component
            :is="MessageComponents[item.msg_type] || 'unknown-message'"
            :data="item"
            :extra="item.extra"
          />
        </div>
        <div
          v-else-if="item.is_revoke == 1"
          class="message-box"
        >
          <item-revoke-message
            :datetime="item.created_at"
            :dialog_type="item.dialog_type"
            :login_uid="uid"
            :username="item.username"
            :user_id="item.user_id"
          />
        </div>
        <div
          v-else
          :class="{
            'direction-rt': item.float == 'right',
            'multi-select': dialogueStore.isOpenMultiSelect,
            'multi-select-check': item.isCheck,
          }"
          class="message-box record-box"
        >
          <aside
            v-if="dialogueStore.isOpenMultiSelect"
            class="checkbox-column"
          >
            <el-checkbox
              :checked="item.isCheck"
              size="small"
              @update:checked="item.isCheck = !item.isCheck"
            />
          </aside>
          <aside class="avatar-column">
            <avatar-box
              :avatar="item.avatar"
              :username="item.username"
              :name="item.name"
              :surname="item.surname"
              class="avatar"
              @click="user(item.user_id)"
            />
          </aside>
          <main class="main-column">
            <div
              v-show="dialog_type == 2 && item.float == 'left'"
              class="dialog-title"
            >
              <span class="username">{{ item.username }}</span>
            </div>
            <div
              :class="{ cursor: dialogueStore.isOpenMultiSelect }"
              class="dialog-content"
              @click="onRowClick(item)"
            >
              <div
                v-if="item.extra.reply"
                class="dialog-reply"
              >
                <div
                  class="_reply"
                  @click="onJumpMessage(item.extra?.reply?.msg_id)"
                >
                  <span class="_username"> {{ item.extra?.reply?.username }}</span>
                  <span class="_content">{{ item.extra?.reply?.content }}</span>
                </div>
                <component
                  :is="MessageComponents[item.msg_type] || 'unknown-message'"
                  :data="item"
                  :extra="item.extra"
                  :max-width="true"
                  @contextmenu.prevent="onContextMenu($event, item)"
                />
              </div>
              <component
                :is="MessageComponents[item.msg_type] || 'unknown-message'"
                v-else
                :data="item"
                :extra="item.extra"
                :max-width="true"
                @contextmenu.prevent="onContextMenu($event, item)"
              />
            </div>
            <div class="dialog-footer">
              <span>{{ parseTime(item.created_at, 'h:i') }}</span>
              <div
                v-if="dialog_type == 1 && item.float == 'right'"
                class="read-status"
                @click="onClickUsername(item)"
              >
                <el-icon
                  v-show="item.send_status == 1"
                  class="is-loading"
                >
                  <icon-loading />
                </el-icon>
                <span v-show="item.send_status == 1">Отправка...</span>
                <span v-show="item.send_status != 1">
                  <icon-one-check v-if="item.is_read" />
                  <icon-two-check v-else />
                </span>
              </div>
            </div>
          </main>
        </div>
        <div
          v-show="isShowDialogTime(index, item.created_at)"
          class="datetime"
        >
          {{ formatTime(item.created_at) }}
        </div>
      </div>
    </div>
    <circle-scroll-down
      v-model="skipBottom"
      @click="onSkipBottom"
    />
  </section>
  <context-menu
    v-if="dropdown.show"
    :x="dropdown.x"
    :y="dropdown.y"
    :options="dropdown.options"
    @select="onContextMenuHandle"
    @click-outside="closeDropdownMenu"
  />
</template>

<style lang="scss" scoped>
.dialog-reply {
  padding: 3px;
  color: #333;
  background: #F4F4F7;
  border-radius: 0 10px 0 10px;
  overflow: hidden;
  user-select: none;
  cursor: pointer;

  ._reply {
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 5px;

    ._username {
      display: flex;
      align-items: center;
      margin-bottom: 2px;
      font-size: 12px;
      user-select: none;
      color: #a7a0a0;
      opacity: 1;
    }

    ._content {
      padding: 3px;
      color: #333;
    }
  }
}

.section {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.scrollbar {
  &::-webkit-scrollbar {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c0bebc;
  }
}

.dialog-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px 30px;
  overflow-y: auto;
  overflow-x: hidden;
  //background-color: #F5F5F7;

  .load {
    height: 38px;
    text-align: center;
    line-height: 38px;
    font-size: 13px;
    cursor: pointer;

    .no-more {
      color: #b9b3b3;
    }
  }

  .message-box {
    width: 100%;
    min-height: 30px;
    margin-bottom: 5px;
  }

  .datetime {
    height: 30px;
    line-height: 30px;
    color: #a7a0a0;
    font-size: 12px;
    text-align: center;
    margin: 5px 0;
    //    display: flex;
    //    align-items: center;
    //    &:before {
    //      margin-right: 15px;
    //    }
    //    &:after {
    //      margin-left: 15px;
    //    }
    //&:before, &:after {
    // content: "";
    // height: 1px;
    // background: #ccc9c94f;
    // flex-grow: 1;
    //}
  }

  .record-box {
    display: flex;
    flex-direction: row;

    .checkbox-column {
      display: flex;
      justify-content: center;
      width: 35px;
      order: 1;
      user-select: none;
      padding-top: 12px;
    }

    .avatar-column {
      width: 35px;
      display: flex;
      align-items: center;
      order: 2;
      user-select: none;
      padding-right: 5px;
      flex-direction: column;

      .avatar {
        cursor: pointer;
      }
    }

    .main-column {
      flex: 1 auto;
      order: 3;
      position: relative;
      box-sizing: border-box;
      padding: 5px;
      overflow: hidden;
      min-height: 30px;

      .dialog-title {
        display: flex;
        align-items: center;
        height: 15px;
        margin-bottom: 2px;
        font-size: 12px;
        user-select: none;
        color: #a7a0a0;
        transition: 0.5s ease;
        opacity: 1;

        &.show {
          opacity: 1;
        }

        .username {
          font-weight: bold;
          color: #9e9e9e;
        }

        span {
          transform: scale(0.88);
          transform-origin: left center;
        }
      }

      .dialog-content {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        box-sizing: border-box;
        width: 100%;

        .cursor {
          cursor: pointer;
        }
      }

      .dialog-footer {
        display: flex;
        align-items: center;
        height: 15px;
        margin-top: 5px;
        font-size: 12px;
        user-select: none;
        color: #a7a0a0;
        transition: 0.5s ease;
        opacity: 1;

        .read-status {
          display: flex;
          margin-left: 8px;
          color: #a79e9e;
          font-size: 12px;
          user-select: none;
        }
      }

      &:hover {
        .dialog-title {
          opacity: 1;
        }
      }
    }

    &.direction-rt {
      .avatar-column {
        order: 3;
      }

      .main-column {
        order: 2;

        .dialog-title, .dialog-footer {
          justify-content: flex-end;

          span {
            transform-origin: right center;
          }
        }

        .dialog-content {
          flex-direction: row-reverse;
        }
      }
    }

    &.multi-select {
      border-radius: 5px;

      &:hover,
      &.multi-select-check {
        background-color: #ececec;
      }
    }
  }
}
</style>
