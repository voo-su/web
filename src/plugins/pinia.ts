import type  { App } from 'vue'
import { createPinia } from 'pinia'

export const setPinia = (app: App) => {
  const pinia = createPinia()

  app.use(pinia)
}
