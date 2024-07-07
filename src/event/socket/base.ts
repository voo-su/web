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
