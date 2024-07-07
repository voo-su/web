import Base from './base'
import { useDialogueStore } from '@/store/dialogue'
import { parseTime } from '@/utils/datetime'
import { useDialogStore } from '@/store'

class Revoke extends Base {

  resource
  sender_id = 0
  receiver_id = 0
  dialog_type = 0

  constructor(resource: any) {
    super()
    this.resource = resource
    this.sender_id = resource.sender_id
    this.receiver_id = resource.receiver_id
    this.dialog_type = resource.dialog_type
    this.msg_id = resource.msg_id
    this.handle()
  }

  isCurrSender() {
    return this.sender_id == this.getAccountId()
  }

  getIndexName() {
    if (this.dialog_type == 2) {
      return `${this.dialog_type}_${this.receiver_id}`
    }
    const receiver_id = this.isCurrSender() ? this.receiver_id : this.sender_id
    return `${this.dialog_type}_${receiver_id}`
  }


  handle() {
    useDialogStore().updateItem({
      index_name: this.getIndexName(),
      msg_text: this.resource.text,
      updated_at: parseTime(new Date())
    })
    if (!this.isDialog(this.dialog_type, this.receiver_id, this.sender_id)) {
      return
    }
    useDialogueStore().updateDialogueRecord({
      msg_id: this.msg_id,
      is_revoke: 1
    })
    console.log(12)
  }
}

export default Revoke
