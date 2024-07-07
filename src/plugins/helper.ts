import * as message from '@/components/message/message/item'
import { h } from 'vue'
import { ElIcon } from 'element-plus'

export const setComponents = (app: any) => {
  for (const key in message) {
    app.component(key, message[key])
  }
}

export const renderIcon = (icon: any) => {
  return () => {
    return h(ElIcon, null, { default: () => h(icon) })
  }
}

export const getErrorForField = (field: string, errors: any) => {
  if (!errors && !errors.length) {
    return false
  }

  const filtered = errors.filter((error: any) => {
    return error.path[0] === field
  })

  if (filtered.length) {
    return filtered[0].message
  }
}
