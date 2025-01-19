import type { App } from 'vue'
import { instanceI18n } from '@/utils/i18n'

export const setLocale = (app: App) => {
  const i18n = instanceI18n()

  app.use(i18n as any)
}
