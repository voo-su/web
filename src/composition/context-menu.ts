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
