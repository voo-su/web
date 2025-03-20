import { useUserStore } from '@/store/user'
import { useMessageStore } from '@/store/message'

class Base {

  getAccountId() {
    return useUserStore().uid
  }

  getParams() {
    const messageStore = useMessageStore()
    const {
      chat_type,
      receiver_id
    } = messageStore.chat
    return {
      chat_type,
      receiver_id,
      index_name: messageStore.index_name
    }
  }

  isChat(type: number, senderId: number, receiverId:number) {
    const params = this.getParams()
    if (type != params.chat_type) {
      return false
    } else if (
      params.receiver_id == receiverId ||
      params.receiver_id == senderId
    ) {
      return true
    }
    return false
  }
}

export default Base
