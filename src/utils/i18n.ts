import { createI18n } from 'vue-i18n'
import locale from '@/locale'

export const i18n = () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'ru',
    messages: locale
  })

  return i18n.global.t
}
