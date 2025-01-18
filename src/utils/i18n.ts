import { createI18n } from 'vue-i18n'
import locale from '@/locale'

export const i18n = () => {
  const i18n = createI18n({
    legacy: false,
    locale: import.meta.env.VITE_DEFAULT_LANGUAGE,
    messages: locale
  })

  return i18n.global.t
}
