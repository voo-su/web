import { createApp } from 'vue'
import router from '@/router'
import App from '@/App.vue'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/notification.scss'
import '@/assets/scss/main.scss'
import * as plugins from '@/plugins'

const bootstrap = async () => {
  const app = createApp(App)
  app.use(router)

  plugins.setLocale(app)
  plugins.setPinia(app)
  plugins.setComponents(app)
  plugins.setupDirective(app)

  app.mount('#app')
}

bootstrap()
