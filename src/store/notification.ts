import { defineStore } from 'pinia'
import { storage } from '@/utils/storage/local-storage'

interface INotify {
  isPromptTone: any
  isKeyboard: any
  isLeaveWeb: boolean
  isWebNotify: boolean
}

export const useNotificationStore = defineStore('notification', {
  state: (): INotify => ({
    isPromptTone: storage.get<boolean>('isPromptTone', true),
    isKeyboard: storage.get<boolean>('isKeyboard', true),
    isLeaveWeb: false,
    isWebNotify: false
  }),
  actions: {
    setPromptTone(value: any) {
      this.isPromptTone = value
      storage.set('isPromptTone', value, null)
    },

    setKeyboard(value: any) {
      this.isKeyboard = value
      storage.set('isKeyboard', value, null)
    }
  }
})
