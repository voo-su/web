import router from '@/router'
import { useUserStore } from '@/store/user'
import { useDialogueStore } from '@/store/dialogue'

class Base {

  constructor() {
  }

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

  isDialog(dialog_type, sender_id, receiver_id) {
    const params = this.getDialogParams()
    if (dialog_type != params.dialog_type) {
      return false
    } else if (
      params.receiver_id == receiver_id ||
      params.receiver_id == sender_id
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
