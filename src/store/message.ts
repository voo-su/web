import { defineStore } from 'pinia'
import { forwardMessagesApi, removeMessagesApi, revokeMessagesApi } from '@/api/chat'
import { getGroupMembersApi } from '@/api/group-chat'
import { ElMessage } from 'element-plus'

interface IChat {
  username: string
  avatar: string
  name: string
  surname: string
  chat_type: number
  receiver_id: number
}

interface IMessageItems {
  chat_type: number
  receiver_id: number
  read_sequence: number
  messages: any
}

interface IMember {

}

interface IRecord {

}

interface IMessageState {
  chatId: number
  index_name: string | null
  chat: IChat
  is_bot: number
  keyboard: boolean
  online: boolean
  messages: IRecord[]
  unreadBubble: number
  isOpenMultiSelect: boolean
  isShowEditor: boolean
  isShowSessionList: boolean
  members: IMember[]
  items: IMessageItems[]
}

let keyboardTimeout: any = null

export const useMessageStore = defineStore('message', {
  state: (): IMessageState => ({
    chatId: 0,
    index_name: null,
    chat: {
      username: '',
      avatar: '',
      name: '',
      surname: '',
      chat_type: 0,
      receiver_id: 0
    },
    is_bot: 0,
    keyboard: false,
    online: false,
    messages: [],
    unreadBubble: 0,
    isOpenMultiSelect: false,
    isShowEditor: false,
    isShowSessionList: true,
    members: [],
    items: [
      {
        chat_type: 1,
        receiver_id: 0,
        read_sequence: 0,
        messages: []
      }
    ]
  }),

  actions: {
    setOnlineStatus(status: boolean) {
      this.online = status
    },

    setMessage(data: any = {}) {
      this.chatId = data.id
      this.online = data.is_online == 1
      this.is_bot = data.is_bot
      this.chat = {
        username: data.username,
        avatar: data.avatar,
        name: data.name,
        surname: data.surname,
        chat_type: data.chat_type,
        receiver_id: data.receiver_id
      }
      this.index_name = data.chat_type + '_' + data.receiver_id
      this.messages = []
      this.unreadBubble = 0
      this.isShowEditor = data.is_bot === 0

      if (data.chat_type == 2) {
        this.updateGroupMembers()
      } else {
        this.members = []
      }
    },

    async updateGroupMembers() {
      const {
        code,
        data
      } = await getGroupMembersApi({
        group_id: this.chat.receiver_id
      })

      if (code != 200) return
      this.members = []
      for (const o of data.items) {
        this.members.push({
          id: o.user_id,
          username: o.username,
          avatar: o.avatar,
          gender: o.gender,
          leader: o.leader,
          online: false,
          value: o.username
        })
      }
    },

    clearMessage() {
      this.messages = []
    },

    unshiftMessage(messages: any) {
      this.messages.unshift(...messages)
    },

    addMessage(record: any) {
      this.messages.push(record)
    },

    updateMessage(params: any) {
      const { msg_id = '' } = params
      const item = this.messages.find((item: { msg_id: number }) => item.msg_id === msg_id)
      item && Object.assign(item, params)
    },

    batchMessageDel(ids: number[]) {
      ids.forEach((id: number) => {
        const index = this.messages.findIndex((item: { id: number }) => item.id === id)
        if (index >= 0) this.messages.splice(index, 1)
      })
    },

    triggerKeyboard() {
      this.keyboard = true
      clearTimeout(keyboardTimeout)
      keyboardTimeout = setTimeout(() => (this.keyboard = false), 2000)
    },

    setUnreadBubble(value: number) {
      if (value == 0) {
        this.unreadBubble = 0
      } else {
        this.unreadBubble++
      }
    },

    closeMultiSelect() {
      this.isOpenMultiSelect = false
      for (const item of this.selectItems) {
        if (item.isCheck) {
          item.isCheck = false
        }
      }
    },

    deleteRecord(ids: number[] = []) {
      removeMessagesApi({
        chat_type: this.chat.chat_type,
        receiver_id: this.chat.receiver_id,
        msg_ids: ids.join(',')
      })
        .then(({ code, message }: any) => {
          if (code == 200) {
            this.batchMessageDel(ids)
          } else {
            ElMessage.warning(message)
          }
        })
    },

    revokeRecord(msg_id: string = '') {
      revokeMessagesApi({ msg_id })
        .then(({ code, message }: any) => {
          if (code == 200) {
            this.updateMessage({
              msg_id, is_revoke: 1
            })
          } else {
            ElMessage.warning(message)
          }
        })
    },

    forwardRecord(options: any) {
      const data = Object.assign({
        chat_type: this.chat.chat_type,
        receiver_id: this.chat.receiver_id
      }, options)

      forwardMessagesApi(data)
        .then(({ code }: any) => {
          if (code == 200) {
            this.closeMultiSelect()
          }
        })
    }
  },

  getters: {
    selectItems: state => state.messages.filter((item: any) => item.isCheck),

    isGroupChat: state => state.chat.chat_type === 2
  }
})
