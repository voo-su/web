// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { useDark, useToggle } from '@vueuse/core'

export const isDark = useDark({
  storageKey: 'voo_su_color_scheme',
  emitAuto: false,
  initialValue: 'light'
})

export const toggleDark = useToggle(isDark)
