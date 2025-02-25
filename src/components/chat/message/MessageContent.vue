<script lang="ts" setup>
import { computed, inject, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { Loading as IconLoading } from '@element-plus/icons-vue'
import CircleScrollDown from '../CircleScrollDown.vue'
import socket from '@/utils/socket'
import { useMessageStore } from '@/store'
import { formatTime, parseTime } from '@/utils/datetime'
import { clipboard, clipboardImage, htmlDecode } from '@/utils/common'
import { addClass, removeClass } from '@/utils/dom'
import { downloadImage } from '@/utils/functions'
import { formatRecord } from '@/utils/chat'
import { forwardableMessageType, messageComponents } from '@/constants/message'
import { getRecordsApi } from '@/api/chat'
import { useMenu } from './menu'
import ContextMenu from '@/components/base/BaseContextMenu.vue'
import AvatarBox from '@/components/base/BaseAvatarBox.vue'
import IconOneCheck from '@/components/icons/IconOneCheck.vue'
import IconTwoCheck from '@/components/icons/IconTwoCheck.vue'
import { publisher } from '@/utils/publisher'
import ItemRevokeMessage from '@/components/chat/message/item/ItemRevokeMessage.vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  uid: {
    type: Number,
    default: 0
  },
  chat_type: {
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

const {
  dropdown,
  showDropdownMenu,
  closeDropdownMenu
} = useMenu()
const { t } = useI18n()
const user: any = inject('$user')
const messageStore = useMessageStore()
const records = computed(() => messageStore.records)

interface ILoadConfig {
  status: number
  minRecord: number
}

const loadConfig = reactive<ILoadConfig>({
  status: 0,
  minRecord: 0
})

const skipBottom = ref<boolean>(false)

let locationMessage: any = null

const onLoad = () => {
  const data = {
    chat_type: props.chat_type,
    receiver_id: props.receiver_id,
    record_id: loadConfig.minRecord,
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

  getRecordsApi(data)
    .then(res => {
      if (
        data.chat_type != props.chat_type ||
        data.receiver_id != props.receiver_id
      ) {
        locationMessage = null
        return
      }

      const records = res.data.items || []

      records.map((item: any) => formatRecord(props.uid, item))

      if (data.record_id == 0) {
        messageStore.clearMessage()
      }

      if (props.chat_type == 1) {
        onAfterRead(records)
      }

      messageStore.unshiftMessage(records.reverse())

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
      ids.push(record.msg_id)
    }
  }

  if (ids.length) {
    socket.emit('voo.message.read', {
      receiver_id: props.receiver_id,
      msg_ids: ids
    })
  }
}

const isShowMessageTime = (index: number, datetime: string) => {
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
    onLoad()
  }

  const height = e.target.scrollTop + e.target.clientHeight
  skipBottom.value = height < e.target.scrollHeight - 200

  if (!skipBottom.value && messageStore.unreadBubble) {
    messageStore.setUnreadBubble(0)
  }
}

const onCopyText = (data: any) => {
  if (data.content && data.content.length > 0) {
    const content = data.selectedText || data.content
    // return clipboard(htmlDecode(content), () => {})
    return clipboard(content, () => {})
  }

  if (data.extra?.url) {
    return clipboardImage(data.extra.url, () => () => {})
  }
}

const onChatDelete = (data: {id: number}) => {
  messageStore.deleteRecord([data.id])
}

const onMessageRevoke = (data: any) => {
  messageStore.revokeRecord(data.msg_id)
}

const onDownloadFile = (data: any) => {
  if (data.msg_type == 3) {
    return downloadImage(data.extra.url, `${data.msg_id}.${data.extra.suffix}`)
  }

  if (data.msg_type == 4) {
    return ElMessage.info(t('audioUploadNotSupported'))
  }

  return ElMessage.info(t('videoUploadNotSupported'))
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
      item.description = t('code')
      break
    case 3:
      item.image = data.extra.url
      break
    case 4:
      item.description = t('audioRecording')
      break
    case 5:
      item.description = t('video')
      break
    case 6:
      item.description = t('unknownMessageType')
      break
    case 7:
      item.description = t('location')
      break
    case 8:
      item.description = t('card')
      break
    case 9:
      item.description = t('forwardedMessage')
      break
    case 10:
      item.description = t('loginNotification')
      break
    case 11:
      item.description = t('poll')
      break
    case 12:
      item.description = t('photo')
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
  if (!messageStore.isShowEditor || messageStore.isOpenMultiSelect) {
    return e.preventDefault()
  }

  item.selectedText = window.getSelection().toString()

  showDropdownMenu(e, props.uid, item)

  e.preventDefault()
}

// const onMultiSelect = (data: any) => {
//   messageStore.updateMessage({
//     id: data.id,
//     isCheck: true
//   })
//
//   messageStore.isOpenMultiSelect = true
// }
//
// const onForwardMessage = (data: any) => {
//   console.log(data)
// }

const onContextMenuHandle = (key: string) => {
  const events: any = {
    copy: onCopyText,
    delete: onChatDelete,
    revoke: onMessageRevoke,
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
        ElMessage.info(t('viewLimitRecords'))
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
  onLoad()
}

const onRowClick = (item: any) => {
  if (messageStore.isOpenMultiSelect) {
    if (forwardableMessageType.includes(item.msg_type)) {
      item.isCheck = !item.isCheck
    } else {
      ElMessage.info(t('messageForwardingNotSupported'))
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
      class="scrollbar message-container"
      @scroll="onPanelScroll($event)"
    >
      <div class="load">
        <span v-if="loadConfig.status == 0">{{ t('loadingData') }}</span>
        <span
          v-else-if="loadConfig.status == 1"
          @click="onLoad"
        >
          {{ t('more') }}
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
            :is="messageComponents[item.msg_type] || 'unknown-message'"
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
            :chat_type="item.chat_type"
            :login_uid="uid"
            :username="item.username"
            :user_id="item.user_id"
          />
        </div>
        <div
          v-else
          :class="{
            'direction-rt': item.float == 'right',
            'multi-select': messageStore.isOpenMultiSelect,
            'multi-select-check': item.isCheck,
          }"
          class="message-box record-box"
        >
          <aside
            v-if="messageStore.isOpenMultiSelect"
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
              v-show="chat_type == 2 && item.float == 'left'"
              class="message-title"
            >
              <span class="username">{{ item.username }}</span>
            </div>
            <div
              :class="{ cursor: messageStore.isOpenMultiSelect }"
              class="message-content"
              @click="onRowClick(item)"
            >
              <div
                v-if="item.extra.reply"
                class="message-reply"
              >
                <div
                  class="_reply"
                  @click="onJumpMessage(item.extra?.reply?.msg_id)"
                >
                  <span class="_username"> {{ item.extra?.reply?.username }}</span>
                  <span class="_content">{{ item.extra?.reply?.content }}</span>
                </div>
                <component
                  :is="messageComponents[item.msg_type] || 'unknown-message'"
                  :data="item"
                  :extra="item.extra"
                  :max-width="true"
                  @contextmenu.prevent="onContextMenu($event, item)"
                />
              </div>
              <component
                :is="messageComponents[item.msg_type] || 'unknown-message'"
                v-else
                :data="item"
                :extra="item.extra"
                :max-width="true"
                @contextmenu.prevent="onContextMenu($event, item)"
              />
            </div>
            <div class="message-footer">
              <span>{{ parseTime(item.created_at, 'h:i') }}</span>
              <div
                v-if="chat_type == 1 && item.float == 'right'"
                class="read-status"
                @click="onClickUsername(item)"
              >
                <el-icon
                  v-show="item.send_status == 1"
                  class="is-loading"
                >
                  <icon-loading />
                </el-icon>
                <span v-show="item.send_status == 1">{{ t('sending') }}</span>
                <span v-show="item.send_status != 1">
                  <icon-one-check v-if="item.is_read" />
                  <icon-two-check v-else />
                </span>
              </div>
            </div>
          </main>
        </div>
        <div
          v-show="isShowMessageTime(index, item.created_at)"
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
.message-reply {
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

.message-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px 30px;
  overflow-y: auto;
  overflow-x: hidden;

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

      .message-title {
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

      .message-content {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        box-sizing: border-box;
        width: 100%;

        .cursor {
          cursor: pointer;
        }
      }

      .message-footer {
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
        .message-title {
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

        .message-title, .message-footer {
          justify-content: flex-end;

          span {
            transform-origin: right center;
          }
        }

        .message-content {
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
