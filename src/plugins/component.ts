import type { App } from 'vue'
import * as message from '@/components/chat/message/item'
import { modal } from '@/utils/common'
import ContactUserCard from '@/components/contact/ContactUserCard.vue'

export const setComponents = (app: App) => {
  app.provide('$user', (uid: number) => {
    modal(ContactUserCard, {
        uid: parseInt(uid)
      },
      () => { }
    )
  })

  for (const key in message) {
    app.component(key, message[key])
  }
}
