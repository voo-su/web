import { defineStore } from 'pinia'
import { chatsApi } from '@/api/chat'
import { formatDialogItem } from '@/utils/chat'
import { i18n } from '@/utils/i18n'

const t = i18n()

const ttime = (datetime: any) => {
  if (datetime == undefined || datetime == '') {
    return new Date().getTime()
  }
  return new Date(datetime.replace(/-/g, '/')).getTime()
}

interface IItems {
  unread_num: any
  msg_text: any
  updated_at: any
  is_top: any
}

interface IDialog {
  loadStatus: number
  items: IItems[]
}

export const useDialogStore = defineStore('dialog', {
  state: (): IDialog => {
    return {
      loadStatus: 2,
      items: []
    }
  },
  actions: {
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
    },

    loadDialogList() {
      this.loadStatus = 2
      chatsApi()
        .then(({ code, data }: any) => {
          if (code == 200) {
            this.items = data.items.map((item: any) => formatDialogItem(item))
            this.loadStatus = 3
          } else {
            this.loadStatus = 4
          }
        })
        .catch((err: any) => {
          console.error(t('failed'), err)
          this.loadStatus = 4
        })
    }
  },
  getters: {
    topItems: state => {
      return state.items.filter((item: any) => item.is_top == 1)
    },

    dialogItems: state => {
      const items = state.items.sort((a, b) => {
        return ttime(b.updated_at) - ttime(a.updated_at)
      })

      items.sort((a, b) => b.is_top - a.is_top)

      return items
    },

    dialogUnreadNum: state => {
      return state.items.reduce((total, item) => {
        return total + parseInt(item.unread_num)
      }, 0)
    }
  }
})
