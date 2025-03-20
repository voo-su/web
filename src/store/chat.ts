import { defineStore } from 'pinia'
import { chatsApi } from '@/api/chat'
import { formatMessageItem } from '@/utils/chat'
import { i18n } from '@/utils/i18n'
import { logE } from '@/utils/log'

const tTime = (datetime: string | undefined): number => {
  if (!datetime) {
    return new Date().getTime()
  }
  return new Date(datetime.replace(/-/g, '/')).getTime()
}

interface IChatItem {
  index_name: string
  unread_num: number
  msg_text: string
  updated_at: string
  is_top: number
}

interface IChat {
  loadStatus: number
  items: IChatItem[]
}

export const useChatStore = defineStore('chat', {
  state: (): IChat => ({
    loadStatus: 2,
    items: []
  }),
  actions: {
    async loadList() {
      this.loadStatus = 2
      try {
        const { code, data } = await chatsApi()
        if (code === 200) {
          this.items = data.items.map((item: any) => formatMessageItem(item))
          this.loadStatus = 3
        } else {
          this.loadStatus = 4
        }
      } catch (err: any) {
        logE(`${i18n('failed')}: ${err}`)
        this.loadStatus = 4
      }
    },

    findItem(index_name: string): IChatItem | undefined {
      return this.items.find((item) => item.index_name === index_name)
    },

    updateItem(params: IChatItem) {
      const item = this.items.find((item) => item.index_name === params.index_name)
      if (item) {
        Object.assign(item, params)
      }
    },

    addItem(params: IChatItem) {
      this.items = [params, ...this.items]
    },

    delItem(index_name: string) {
      const i = this.items.findIndex((item) => item.index_name === index_name)
      if (i >= 0) {
        this.items.splice(i, 1)
      }
      this.items = [...this.items]
    },

    updateMessage(params: {
      index_name: string
      msg_text: string
      updated_at: string
    }) {
      const item = this.items.find((item) => item.index_name === params.index_name)
      if (item) {
        item.unread_num++
        item.msg_text = params.msg_text
        item.updated_at = params.updated_at
      }
    }
  },
  getters: {
    getTopItems: (state): IChatItem[] => {
      return state.items.filter((item) => item.is_top === 1)
    },

    getItems: (state): IChatItem[] => {
      const items = state.items.sort((a, b) => tTime(b.updated_at) - tTime(a.updated_at))
      items.sort((a, b) => b.is_top - a.is_top)
      return items
    },

    getUnreadNum: (state): number => {
      return state.items.reduce((total, item) => total + item.unread_num, 0)
    }
  }
})
