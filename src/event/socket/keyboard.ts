// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import Base from './base'
import { useDialogueStore } from '@/store/dialogue'

class Keyboard extends Base {

  resource: any

  constructor(resource: any) {
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
