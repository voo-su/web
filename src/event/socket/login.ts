import Base from './base'
import { useChatStore } from '@/store'
import { useMessageStore } from '@/store/message'

class Login extends Base {

  resource

  constructor(resource: any) {
    super()
    this.resource = resource
    this.handle()
  }

  handle() {
    useChatStore().updateItem({
      index_name: `1_${this.resource.user_id}`,
      is_online: this.resource.status
    })

    if (this.isChat(1, this.resource.user_id, this.getAccountId())) {
      useMessageStore().setOnlineStatus(this.resource.status == 1)
    }
  }
}

export default Login
