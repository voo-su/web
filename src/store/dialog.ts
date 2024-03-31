import { defineStore } from 'pinia'
import { chatsApi } from '@/api/chat'
import { formatDialogItem } from '@/utils/dialog'

const ttime = datetime => {
  if (datetime == undefined || datetime == '') {
    return new Date().getTime()
  }
  return new Date(datetime.replace(/-/g, '/')).getTime()
}

export const useDialogStore = defineStore('dialog', {
  state: () => {
    return {
      loadStatus: 2,
      items: []
    }
  },
  actions: {
    findItem(index_name) {
      return this.items.find(item => item.index_name === index_name)
    },

    updateItem(params: any) {
      const item = this.items.find(item => item.index_name === params.index_name)
      item && Object.assign(item, params)
    },

    addItem(params) {
      this.items = [params, ...this.items]
    },

    delItem(index_name) {
      const i = this.items.findIndex(item => item.index_name === index_name)
      if (i >= 0) {
        this.items.splice(i, 1)
      }
      this.items = [...this.items]
    },

    updateMessage(params) {
      const item = this.items.find(
        item => item.index_name === params.index_name
      )
      if (item) {
        item.unread_num++
        item.msg_text = params.msg_text
        item.updated_at = params.updated_at
      }
    },

    loadDialogList() {
      this.loadStatus = 2
      chatsApi()
        .then((res: any) => {
          const {
            code,
            data
          } = res
          if (code == 200) {
            this.items = data.items.map(item => formatDialogItem(item))
            this.loadStatus = 3
          } else {
            this.loadStatus = 4
          }
        })
        .catch(() => {
          this.loadStatus = 4
        })
    }
  },
  getters: {
    topItems: state => {
      return state.items.filter(item => item.is_top == 1)
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
