// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { h, ref } from 'vue'

export const useContextMenu = () => {
  const isShow = ref<boolean>(false)
  const showContextMenu = () => {
    isShow.value = true
  }
  const closeContextMenu = () => {
  }
  const renderContextMenu = () => {
    return h('div', {
      id: 'foo',
      class: 'bar'
    }, [])
  }
  return {
    showContextMenu,
    closeContextMenu,
    renderContextMenu
  }
}
