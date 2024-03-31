import Base from './base'
import { useDialogStore } from '@/store'
import { useDialogueStore } from '@/store/dialogue'

class Login extends Base {

  resource

  constructor(resource) {
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
