import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => {
    return {
      items: []
    }
  },
  actions: {
    addItems(items) {
      this.items = items
    }
  },
  getters: {
    getItems: state => {
      return state.items
    },
    getTypes: state => {
      return state.items.map(item => {
        return {
          id: item.id,
          title: item.title
        }
      })
    }
  }
})
