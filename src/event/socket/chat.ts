import Base from './base'
import { nextTick } from 'vue'
import socket from '@/utils/socket'
import { parseTime } from '@/utils/datetime'
import { WebNotify } from '@/utils/notification'
import * as message from '@/constants/message'
import { findChatIndex, formatMessageItem, formatRecord, palyMusic } from '@/utils/chat'
import { clearUnreadChatApi, createChatApi } from '@/api/chat'
import { useChatStore } from '@/store'
import { useMessageStore } from '@/store/message'
import { useNotificationStore } from '@/store/notification'
import { ElMessage } from 'element-plus'
import {
  GROUP_CHAT_MSG_SYS_MEMBER_JOIN,
  GROUP_CHAT_MSG_SYS_MEMBER_KICKED,
  GROUP_CHAT_MSG_SYS_MEMBER_QUIT
} from '@/constants/chat'
import type { IResource, IResourceData } from './type'
import { i18n } from '@/utils/i18n'

class Chat extends Base {

  resource: IResourceData
  sender_id: number = 0
  receiver_id: number = 0
  chat_type: number = 0

  constructor(resource: IResource) {
    super()
    this.sender_id = resource.sender_id
    this.receiver_id = resource.receiver_id
    this.chat_type = resource.chat_type
    this.resource = resource.data
    this.handle()
  }

  isCurrSender() {
    return this.sender_id == this.getAccountId()
  }

  getIndexName() {
    if (this.chat_type == 2) {
      return `${this.chat_type}_${this.receiver_id}`
    }
    const receiver_id = this.isCurrSender() ? this.receiver_id : this.sender_id
    return `${this.chat_type}_${receiver_id}`
  }

  getMessageText() {
    let text = this.resource.content.replace(/<img .*?>/g, '')
    if (this.resource.msg_type != message.chatMsgTypeText) {
      text = message.chatMsgTypeMapping[this.resource.msg_type]
    }
    return text
  }

  play() {
    useNotificationStore().isPromptTone && palyMusic()
  }

  handle() {
    if (!this.isCurrSender()) {
      // TODO`
    }

    if (findChatIndex(this.getIndexName()) == -1) {
      return this.addChatItem()
    }

    if (this.isChat(this.chat_type, this.receiver_id, this.sender_id)) {
      this.insertMessageItem()
    } else {
      this.play()
      this.updateMessageItem()
    }
  }

  showMessageNocice() {
    if (useNotificationStore().isLeaveWeb) {
      if (useNotificationStore().isWebNotify) {
        WebNotify(i18n('messageNotification'), {
          dir: 'auto',
          lang: 'ru-RU',
          body: i18n('newMessageNotification')
        })
      }
    } else {
      ElMessage.info(i18n('messageNotification'))
    }
  }

  addChatItem() {
    let receiver_id = this.sender_id
    const { chat_type } = this

    // TODO
    if (chat_type == 1 && this.receiver_id != this.getAccountId()) {
      receiver_id = this.receiver_id
    } else if (chat_type == 2) {
      receiver_id = this.receiver_id
    }

    createChatApi({
      chat_type,
      receiver_id
    }).then(({ code, data }: any) => {
      if (code == 200) {
        useChatStore().addItem(formatMessageItem(data))
        this.play()
      }
    })
  }

  insertMessageItem() {
    const record = this.resource

    if ([GROUP_CHAT_MSG_SYS_MEMBER_JOIN, GROUP_CHAT_MSG_SYS_MEMBER_QUIT, GROUP_CHAT_MSG_SYS_MEMBER_KICKED].includes(record.msg_type)) {
      useMessageStore().updateGroupMembers()
    }

    useMessageStore().addMessage(
      formatRecord(this.getAccountId(), this.resource)
    )

    if (!this.isCurrSender()) {
      setTimeout(() => {
        socket.emit('voo.message.read', {
          receiver_id: this.sender_id,
          msg_ids: [this.resource.msg_id]
        })
      }, 1000)
    }

    const el = document.getElementById('chat-panel')
    if (!el) {
      return
    }
    const isBottom = Math.ceil(el.scrollTop) + el.clientHeight >= el.scrollHeight
    if (isBottom || record.user_id == this.getAccountId()) {
      nextTick(() => {
        el.scrollTop = el.scrollHeight + 1000
      })
    } else {
      useMessageStore().setUnreadBubble(1)
    }
    useChatStore().updateItem({
      index_name: this.getIndexName(),
      msg_text: this.getMessageText(),
      updated_at: parseTime(new Date())
    })
    if (this.chat_type == 1 && this.getAccountId() !== this.sender_id) {
      clearUnreadChatApi({
        chat_type: 1,
        receiver_id: this.sender_id
      })
    }
  }

  updateMessageItem() {
    useChatStore().updateMessage({
      index_name: this.getIndexName(),
      msg_text: this.getMessageText(),
      updated_at: parseTime(new Date())
    })
  }
}

export default Chat
