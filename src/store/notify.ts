// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { defineStore } from 'pinia'
import { storage } from '@/utils/storage/local-storage'

interface INotify {
  isPromptTone: any
  isKeyboard: any
  isLeaveWeb: boolean
  isWebNotify: boolean
}

export const useNotifyStore = defineStore('notify', {
  state: (): INotify => {
    return {
      isPromptTone: storage.get('isPromptTone', true),
      isKeyboard: storage.get('isKeyboard', true),
      isLeaveWeb: false,
      isWebNotify: false
    }
  },
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
