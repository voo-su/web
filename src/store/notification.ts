import { defineStore } from 'pinia'
import { LStorage } from '@/utils/storage'

interface INotify {
  isPromptTone: any
  isKeyboard: any
  isLeaveWeb: boolean
  isWebNotify: boolean
}

export const useNotificationStore = defineStore('notification', {
  state: (): INotify => ({
    isPromptTone: LStorage.getItem<boolean>('isPromptTone', true),
    isKeyboard: LStorage.getItem<boolean>('isKeyboard', true),
    isLeaveWeb: false,
    isWebNotify: false
  }),
  actions: {
    setPromptTone(value: any) {
      this.isPromptTone = value
      LStorage.addItem('isPromptTone', value, null)
    },

    setKeyboard(value: any) {
      this.isKeyboard = value
      LStorage.addItem('isKeyboard', value, null)
    }
  }
})
