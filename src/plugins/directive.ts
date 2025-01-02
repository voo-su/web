// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import type { App } from 'vue'
import dropsize from '@/directive/dropsize'
import focus from '@/directive/focus'
import paste from '@/directive/paste'
import drag from '@/directive/drag'
import copy from '@/directive/copy'

export const setupDirective = (app: App) => {
  app.directive('dropsize', dropsize)
  app.directive('focus', focus)
  app.directive('paste', paste)
  app.directive('drag', drag)
  app.directive('copy', copy)
}
