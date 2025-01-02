// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import type  { App } from 'vue'
import { createPinia } from 'pinia'

export const setPinia = (app: App) => {
  const pinia = createPinia()

  app.use(pinia)
}
