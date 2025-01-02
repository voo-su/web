// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import Base from './base'
import { useDialogStore } from '@/store'
import { useDialogueStore } from '@/store/dialogue'

class Login extends Base {

  resource

  constructor(resource: any) {
    super()
    this.resource = resource
    this.handle()
  }

  handle() {
    useDialogStore().updateItem({
      index_name: `1_${this.resource.user_id}`,
      is_online: this.resource.status
    })
    if (this.isDialog(1, this.resource.user_id, this.getAccountId())) {
      useDialogueStore().setOnlineStatus(this.resource.status == 1)
    }
  }
}

export default Login
