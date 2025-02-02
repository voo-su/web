import Base from './base'
import { useMessageStore } from '@/store/message'

class Keyboard extends Base {

  resource: any

  constructor(resource: any) {
    super()
    this.resource = resource
    this.handle()
  }

  handle() {
    const params = this.getParams()
    if (params.index_name === null) {
      return false
    }

    if (params.chat_type != 1) {
      return false
    }

    if (params.receiver_id != this.resource.sender_id) {
      return false
    }

    useMessageStore().triggerKeyboard()
  }
}

export default Keyboard
