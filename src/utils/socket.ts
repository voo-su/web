import { useDialogStore } from '@/store'
import { useUserStore } from '@/store/user'
import { useDialogueStore } from '@/store/dialogue'
import { getAccessToken, isLoggedIn } from './auth'
import Ws from '../plugins/ws'
import EventDialog from '../event/socket/dialog'
import EventKeyboard from '../event/socket/keyboard'
import EventLogin from '../event/socket/login'
import EventRevoke from '../event/socket/revoke'

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
        console.log('Метод обратного вызова для неудачного соединения с WebSocket')
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
    this.ws.on('pong', () => {
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
      // window['$notification'].create({
      //   title: 'Уведомление о запросе на добавление в контакты',
      //   content: data.username,
      //   description: `Заявитель: ${data.friend.username}`,
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
      // window['$message'].info('Уведомление о заявке в группу')
      // window['$notification'].create({
      //   title: 'Уведомление о заявке в группу',
      //   content: 'Поступила новая заявка на вступление в группу. Пожалуйста, проверьте.',
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
      window['$message'] && window['$message'].error(JSON.stringify(data))
    })
  }

  emit(event: string, data: any) {
    this.ws.emit(event, data)
  }

}

export default new Socket()
