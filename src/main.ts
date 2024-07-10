import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import "element-plus/theme-chalk/src/message.scss";
import "element-plus/theme-chalk/src/message-box.scss";
import "element-plus/theme-chalk/src/notification.scss";
import '@/assets/scss/main.scss'
import * as plugins from '@/plugins'
import { modal } from '@/utils/common'
import ContactUserCard from '@/components/contact/ContactUserCard.vue'

async function bootstrap() {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.provide('$user', (uid: any) => {
    modal(ContactUserCard, {
      uid: parseInt(uid)
    },
      () => { }
    )
  })
  plugins.setComponents(app)
  plugins.setupDirective(app)
  app.mount('#app')
}

bootstrap()
