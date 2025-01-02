// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import router from '@/router'
import { useUserStore } from '@/store/user'
import { useDialogueStore } from '@/store/dialogue'

class Base {

  getAccountId() {
    return useUserStore().uid
  }

  getDialogParams() {
    const dialogueStore = useDialogueStore()
    const {
      dialog_type,
      receiver_id
    } = dialogueStore.dialog
    return {
      dialog_type,
      receiver_id,
      index_name: dialogueStore.index_name
    }
  }

  isDialog(dialogType: number, senderId: number, receiverId:number) {
    const params = this.getDialogParams()
    if (dialogType != params.dialog_type) {
      return false
    } else if (
      params.receiver_id == receiverId ||
      params.receiver_id == senderId
    ) {
      return true
    }
    return false
  }

  isDialogPage() {
    return ['/message', '/'].includes(router.currentRoute.value.path)
  }
}

export default Base
