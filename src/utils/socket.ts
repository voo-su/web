import { useChatStore } from '@/store'
import { useUserStore } from '@/store/user'
import { useMessageStore } from '@/store/message'
import { getAccessToken, isLoggedIn } from './auth'
import Ws from '@/plugins/ws'
import EventChat from '@/event/socket/chat'
import EventKeyboard from '@/event/socket/keyboard'
import EventLogin from '@/event/socket/login'
import EventRevoke from '@/event/socket/revoke'
import { ElMessageBox, ElNotification, ElMessage } from 'element-plus'
import { i18n } from '@/utils/i18n'
import { log } from '@/utils/log'

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
        log(i18n('websocketConnectionFailedCallback'))
      },

      onOpen: () => {
        useUserStore().updateSocketStatus(true)
        useChatStore().loadList()
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
        i18n('siteUpdated'),
        i18n('siteUpdate'),
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
    this.ws.on('voo.message', (data: any) => new EventChat(data))
  }

  onImMessageRead() {
    this.ws.on('voo.message.read', (data: any) => {
      const messageStore = useMessageStore()
      if (messageStore.index_name !== `1_${data.sender_id}`) {
        return
      }
      const { msg_ids = [] } = data
      for (const msgid of msg_ids) {
        messageStore.updateMessage({
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
      //   title: i18n('contactRequestNotification'),
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
      //   title: i18n('groupRequestNotification'),
      //   content: i18n('newGroupJoinRequest'),
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
