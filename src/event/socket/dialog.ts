import Base from './base'
import { nextTick } from 'vue'
import socket from '@/utils/socket'
import { parseTime } from '@/utils/datetime'
import { WebNotify } from '@/utils/notification'
import * as message from '@/constants/message'
import { findDialogIndex, formatDialogItem, formatDialogRecord, palyMusic } from '@/utils/chat'
import { clearUnreadChatApi, createChatApi } from '@/api/chat'
import { useDialogStore } from '@/store'
import { useDialogueStore } from '@/store/dialogue'
import { useNotifyStore } from '@/store/notify'
import { ElMessage } from 'element-plus'
import {
  GROUP_CHAT_MSG_SYS_MEMBER_JOIN,
  GROUP_CHAT_MSG_SYS_MEMBER_KICKED,
  GROUP_CHAT_MSG_SYS_MEMBER_QUIT
} from '@/constants/dialog'
import type { IResource, IResourceData } from './type'
import { i18n } from '@/utils/i18n'

const t = i18n()

class Dialog extends Base {
  resource: IResourceData
  sender_id: number = 0
  receiver_id: number = 0
  dialog_type: number = 0

  constructor(resource: IResource) {
    super()
    this.sender_id = resource.sender_id
    this.receiver_id = resource.receiver_id
    this.dialog_type = resource.dialog_type
    this.resource = resource.data
    this.handle()
  }

  isCurrSender() {
    return this.sender_id == this.getAccountId()
  }

  getIndexName() {
    if (this.dialog_type == 2) {
      return `${this.dialog_type}_${this.receiver_id}`
    }
    const receiver_id = this.isCurrSender() ? this.receiver_id : this.sender_id
    return `${this.dialog_type}_${receiver_id}`
  }

  getDialogText() {
    let text = this.resource.content.replace(/<img .*?>/g, '')
    if (this.resource.msg_type != message.chatMsgTypeText) {
      text = message.chatMsgTypeMapping[this.resource.msg_type]
    }
    return text
  }

  play() {
    useNotifyStore().isPromptTone && palyMusic()
  }

  handle() {
    if (!this.isCurrSender()) {
      // TODO`
    }

    if (findDialogIndex(this.getIndexName()) == -1) {
      return this.addDialogItem()
    }

    if (this.isDialog(this.dialog_type, this.receiver_id, this.sender_id)) {
      this.insertDialogRecord()
    } else {
      this.play()
      this.updateDialogItem()
    }
  }

  showMessageNocice() {
    if (useNotifyStore().isLeaveWeb) {
      if (useNotifyStore().isWebNotify) {
        WebNotify(t('messageNotification'), {
          dir: 'auto',
          lang: 'ru-RU',
          body: t('newMessageNotification')
        })
      }
    } else {
      ElMessage.info(t('messageNotification'))
    }
  }

  addDialogItem() {
    let receiver_id = this.sender_id
    const { dialog_type } = this

    // TODO
    if (dialog_type == 1 && this.receiver_id != this.getAccountId()) {
      receiver_id = this.receiver_id
    } else if (dialog_type == 2) {
      receiver_id = this.receiver_id
    }

    createChatApi({
      dialog_type,
      receiver_id
    }).then((res: any) => {
      const { code, data } = res

      if (code == 200) {
        useDialogStore().addItem(formatDialogItem(data))
        this.play()
      }
    })
  }

  insertDialogRecord() {
    const record = this.resource

    if ([GROUP_CHAT_MSG_SYS_MEMBER_JOIN, GROUP_CHAT_MSG_SYS_MEMBER_QUIT, GROUP_CHAT_MSG_SYS_MEMBER_KICKED].includes(record.msg_type)) {
      useDialogueStore().updateGroupMembers()
    }

    useDialogueStore().addDialogueRecord(
      formatDialogRecord(this.getAccountId(), this.resource)
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
      useDialogueStore().setUnreadBubble(1)
    }
    useDialogStore().updateItem({
      index_name: this.getIndexName(),
      msg_text: this.getDialogText(),
      updated_at: parseTime(new Date())
    })
    if (this.dialog_type == 1 && this.getAccountId() !== this.sender_id) {
      clearUnreadChatApi({
        dialog_type: 1,
        receiver_id: this.sender_id
      })
    }
  }

  updateDialogItem() {
    useDialogStore().updateMessage({
      index_name: this.getIndexName(),
      msg_text: this.getDialogText(),
      updated_at: parseTime(new Date())
    })
  }
}

export default Dialog
