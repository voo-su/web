import { defineStore } from 'pinia'
import { chatsApi } from '@/api/chat'
import { formatMessageItem } from '@/utils/chat'
import { i18n } from '@/utils/i18n'
import { logE } from '@/utils/log'

const tTime = (datetime: any) => {
  if (datetime == undefined || datetime == '') {
    return new Date().getTime()
  }
  return new Date(datetime.replace(/-/g, '/')).getTime()
}

interface IChatItem {
  unread_num: any
  msg_text: any
  updated_at: any
  is_top: any
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
    loadList() {
      this.loadStatus = 2
      chatsApi()
        .then(({ code, data }: any) => {
          if (code == 200) {
            this.items = data.items.map((item: any) => formatMessageItem(item))
            this.loadStatus = 3
          } else {
            this.loadStatus = 4
          }
        })
        .catch((err: any) => {
          logE(`${i18n('failed')}: ${err}`)
          this.loadStatus = 4
        })
    },

    findItem(index_name: any) {
      return this.items.find((item: any) => item.index_name === index_name)
    },

    updateItem(params: any) {
      const item = this.items.find((item: any) => item.index_name === params.index_name)
      item && Object.assign(item, params)
    },

    addItem(params: any) {
      this.items = [params, ...this.items]
    },

    delItem(index_name: any) {
      const i = this.items.findIndex((item: any) => item.index_name === index_name)
      if (i >= 0) {
        this.items.splice(i, 1)
      }
      this.items = [...this.items]
    },

    updateMessage(params: any) {
      const item = this.items.find((item: any) => item.index_name === params.index_name)
      if (item) {
        item.unread_num++
        item.msg_text = params.msg_text
        item.updated_at = params.updated_at
      }
    }
  },
  getters: {
    getTopItems: state => {
      return state.items.filter((item: any) => item.is_top == 1)
    },

    getItems: state => {
      const items = state.items.sort((a, b) => tTime(b.updated_at) - tTime(a.updated_at))
      items.sort((a, b) => b.is_top - a.is_top)
      return items
    },

    getUnreadNum: state => {
      return state.items.reduce((total, item) => {
        return total + parseInt(item.unread_num)
      }, 0)
    }
  }
})
