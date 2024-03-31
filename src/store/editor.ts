import { defineStore } from 'pinia'

const message = window['$message']

export const useEditorStore = defineStore('editor', {
  state: () => {
    return {
      sticker: {
        items: []
      }
    }
  },
  actions: {

  }
})
