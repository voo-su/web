import type { App } from 'vue'
import * as message from '@/components/message/message/item'
import { modal } from '@/utils/common'
import ContactUserCard from '@/components/contact/ContactUserCard.vue'

export const setComponents = (app: App) => {
  app.provide('$user', (uid: any) => {
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
