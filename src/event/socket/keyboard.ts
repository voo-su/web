import Base from './base'

import { useDialogueStore } from '@/store/dialogue'

class Keyboard extends Base {

  resource

  constructor(resource) {
    super()
    this.resource = resource
    this.handle()
  }

  handle() {
    const params = this.getDialogParams()
    if (params.index_name === null) {
      return false
    }
    if (params.dialog_type != 1) {
      return false
    }
    if (params.receiver_id != this.resource.sender_id) {
      return false
    }
    useDialogueStore().triggerKeyboard()
  }
}

export default Keyboard
