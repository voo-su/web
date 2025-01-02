// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { useDialogStore } from '@/store'
import { useUserStore } from '@/store/user'
import { useDialogueStore } from '@/store/dialogue'
import { getAccessToken, isLoggedIn } from './auth'
import Ws from '../plugins/ws'
import EventDialog from '../event/socket/dialog'
import EventKeyboard from '../event/socket/keyboard'
import EventLogin from '../event/socket/login'
import EventRevoke from '../event/socket/revoke'
import { ElMessageBox, ElNotification, ElMessage } from 'element-plus'
import { i18n } from '@/utils/i18n'

const t = i18n()

const urlCallback = () => {
  if (!isLoggedIn()) {
    window.location.reload()
  }

  return `${import.meta.env.VITE_SOCKET_API}/ws?token=${getAccessToken()}`
}

class Socket {

  private ws: Ws

  constructor() {
    this.ws = new Ws(urlCallback, {
      onError: () => {
        console.log(t('websocketConnectionFailedCallback'))
      },

      onOpen: () => {
        useUserStore().updateSocketStatus(true)
        useDialogStore().loadDialogList()
      },

      onClose: () => {
        useUserStore().updateSocketStatus(false)
      }
    })

    this.bindEvents()
  }

  connect() {
    this.ws.connection()
  }

  disconnect() {
    this.ws.close()
  }

  isConnect() {
    if (!this.ws.connect) {
      return false
    }
    return this.ws.connect.readyState === 1
  }

  bindEvents() {
    this.onPing()
    this.onPong()
    this.onReset()
    this.onImMessage()
    this.onImMessageRead()
    this.onImContactStatus()
    this.onImMessageRevoke()
    this.onImMessageKeyboard()

    this.onImContactApply()
    this.onImGroupApply()
  }

  onPing() {
    this.ws.on('ping', () => this.emit('pong', ''))
  }

  onPong() {
    this.ws.on('pong', () => { })
  }

  onReset() {
    this.ws.on('voo.reset', () => {
      ElMessageBox.confirm(
        t('siteUpdated'),
        t('siteUpdate'),
        {
          center: true,
          showConfirmButton: false,
          showCancelButton: false
        }
      )
        .then(() => {})
        .catch(() => {})
    })
  }

  onImMessage() {
    this.ws.on('voo.message', (data: any) => new EventDialog(data))
  }

  onImMessageRead() {
    this.ws.on('voo.message.read', (data: any) => {
      const dialogueStore = useDialogueStore()
      if (dialogueStore.index_name !== `1_${data.sender_id}`) {
        return
      }
      const { msg_ids = [] } = data
      for (const msgid of msg_ids) {
        dialogueStore.updateDialogueRecord({
          msg_id: msgid,
          is_read: 1
        })
      }
    })
  }

  onImContactStatus() {
    this.ws.on('voo.contact.status', (data: any) => new EventLogin(data))
  }

  onImMessageKeyboard() {
    this.ws.on('voo.message.keyboard', (data: any) => new EventKeyboard(data))
  }

  onImMessageRevoke() {
    this.ws.on('voo.message.revoke', (data: any) => new EventRevoke(data))
  }

  onImContactApply() {
    this.ws.on('voo.contact.request', (data: any) => {
      // ElNotification.create({
      //   title: t('contactRequestNotification'),
      //   content: data.username,
      //   description: `${data.friend.username}`,
      //   meta: data.friend.created_at,
      //   avatar: () =>
      //     h(ElAvatar, {
      //       size: 'small',
      //       round: true,
      //       src: notifyIcon,
      //       style: 'background-color:#fff;'
      //     }),
      //   duration: 3000
      // })
      useUserStore().isContactApply = true
    })
  }

  onImGroupApply() {
    this.ws.on('voo.group_chat.request', () => {
      // ElNotification.create({
      //   title: t('groupRequestNotification'),
      //   content: t('newGroupJoinRequest'),
      //   avatar: () =>
      //     h(NAvatar, {
      //       size: 'small',
      //       round: true,
      //       src: notifyIcon,
      //       style: 'background-color:#fff;',
      //     }),
      //   duration: 30000,
      // })
      useUserStore().isGroupApply = true
    })
  }

  onEventError() {
    this.ws.on('event_error', (data: any) => {
      ElMessage && ElMessage.error(JSON.stringify(data))
    })
  }

  emit(event: string, data: any) {
    this.ws.emit(event, data)
  }
}

export default new Socket()
