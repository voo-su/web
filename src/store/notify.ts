import { defineStore } from 'pinia'
import { storage } from '@/utils/storage/local-storage'

export const useNotifyStore = defineStore('notify', {
  state: () => {
    return {
      isPromptTone: storage.get('isPromptTone', true),
      isKeyboard: storage.get('isKeyboard', true),
      isLeaveWeb: false,
      isWebNotify: false
    }
  },
  actions: {
    setPromptTone(value) {
      this.isPromptTone = value
      storage.set('isPromptTone', value, null)
    },

    setKeyboard(value) {
      this.isKeyboard = value
      storage.set('isKeyboard', value, null)
    }
  }
})
