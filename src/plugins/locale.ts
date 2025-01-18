import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import locale from '@/locale'

export const setLocale = (app: App) => {
  console.log(import.meta.env)
  const i18n = createI18n({
    legacy: false,
    locale: import.meta.env.VITE_DEFAULT_LANGUAGE,
    messages: locale
  })

  app.use(i18n as any)
}
