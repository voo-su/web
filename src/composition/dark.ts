import { useDark, useToggle } from '@vueuse/core'

export const isDark = useDark({
  storageKey: 'voo_su_color_scheme',
  emitAuto: false,
  initialValue: 'light'
})

export const toggleDark = useToggle(isDark)
