import type { I18n } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import locale from '@/locale'
import { logW } from '@/utils/log'

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

export const i18n = (key: string, params: any): string => {
  const i18nInstance = instanceI18n()
  const translatedValue = i18nInstance.global.t(key, params)

  if (translatedValue === key) {
    logW(`Translation key not found: ${key}`)
  }

  return translatedValue
}
