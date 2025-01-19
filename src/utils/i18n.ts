import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'
import locale from '@/locale'

const userLanguage = (): string => {
  const userLang = navigator.language || import.meta.env.VITE_DEFAULT_LANGUAGE
  const supportedLanguages = Object.keys(locale)
  return supportedLanguages.includes(userLang)
    ? userLang
    : (supportedLanguages.includes(import.meta.env.VITE_DEFAULT_LANGUAGE) ? import.meta.env.VITE_DEFAULT_LANGUAGE : 'en')
}

export const instanceI18n = (): I18n => createI18n({
  legacy: false,
  locale: userLanguage(),
  messages: locale
})

export const i18n = () => instanceI18n().global.t
