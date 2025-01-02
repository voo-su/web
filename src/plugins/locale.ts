// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import locale from '@/locale'

export const setLocale = (app: App) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'ru',
    messages: locale
  })

  app.use(i18n)
}
