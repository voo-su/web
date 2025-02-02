import Base from './base'
import { useMessageStore } from '@/store/message'
import { parseTime } from '@/utils/datetime'
import { useChatStore } from '@/store'

class Revoke extends Base {
  resource: any
  sender_id: number = 0
  receiver_id: number = 0
  chat_type: number = 0
  msg_id: any

  constructor(resource: any) {
    super()
    this.resource = resource
    this.sender_id = resource.sender_id
    this.receiver_id = resource.receiver_id
    this.chat_type = resource.chat_type
    this.msg_id = resource.msg_id
    this.handle()
  }

  isCurrSender() {
    return this.sender_id == this.getAccountId()
  }

  getIndexName() {
    if (this.chat_type == 2) {
      return `${this.chat_type}_${this.receiver_id}`
    }

    const receiver_id = this.isCurrSender() ? this.receiver_id : this.sender_id
    return `${this.chat_type}_${receiver_id}`
  }

  handle() {
    useChatStore().updateItem({
      index_name: this.getIndexName(),
      msg_text: this.resource.text,
      updated_at: parseTime(new Date())
    })

    if (!this.isChat(this.chat_type, this.receiver_id, this.sender_id)) {
      return
    }

    useMessageStore().updateMessage({
      msg_id: this.msg_id,
      is_revoke: 1
    })
  }
}

export default Revoke
