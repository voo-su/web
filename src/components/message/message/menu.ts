import { markRaw, reactive } from 'vue'
import {
  ChatRound as IconChatRound,
  CopyDocument as IconCopyDocument,
  Delete as IconDelete,
  Download as IconDownload,
  Remove as RemoveIcon
} from '@element-plus/icons-vue'
import type { IDropdown } from './types'
import IconForward from '@/components/icons/IconForward.vue'

const isRevoke = (uid: any, item: any): boolean => {
  if (uid != item.user_id) {
    return false
  }
  const datetime = item.created_at.replace(/-/g, '/')
  const time = new Date().getTime() - Date.parse(datetime)
  return Math.floor(time / 1000 / 60) <= 2
}

export const useMenu = () => {
  const dropdown: IDropdown = reactive({
    options: [],
    show: false,
    x: 0,
    y: 0,
    item: {}
  })

  const showDropdownMenu = (e: any, uid: number, item: any) => {
    dropdown.item = Object.assign({}, item)
    dropdown.options = []
    if ([1, 3].includes(item.msg_type)) {
      dropdown.options.push({
        label: 'Копировать',
        icon: markRaw(IconCopyDocument),
        key: 'copy'
      })
    }

    dropdown.options.push({
      label: 'Ответить',
      icon: markRaw(IconChatRound),
      key: 'quote'
    })

    if (isRevoke(uid, item)) {
      dropdown.options.push({
        label: `Отозвать`,
        icon: markRaw(RemoveIcon),
        key: 'revoke'
      })
    }

    // dropdown.options.push({
    //   label: 'Переслать',
    //   icon: markRaw(IconForward),
    //   key: 'forward'
    // })

    // dropdown.options.push({
    //   label: 'Выделить',
    //   icon: markRaw(IconForward),
    //   key: 'multiSelect'
    // })

    if ([3, 4, 5].includes(item.msg_type)) {
      dropdown.options.push({
        label: 'Скачать',
        icon: markRaw(IconDownload),
        key: 'download'
      })
    }

    dropdown.options.push({
      label: 'Удалить',
      icon: markRaw(IconDelete),
      key: 'delete'
    })

    dropdown.x = e.clientX
    dropdown.y = e.clientY
    dropdown.show = true
  }

  const closeDropdownMenu = () => {
    dropdown.show = false
    dropdown.item = {}
  }

  return {
    dropdown,
    showDropdownMenu,
    closeDropdownMenu
  }
}
