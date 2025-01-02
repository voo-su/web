// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

export default {
  created(el: any, binding: any) {
    el.addEventListener('dragenter', (event: any) => {
      event.stopPropagation()
      event.preventDefault()
    })
    el.addEventListener('dragover', (event: any) => {
      event.stopPropagation()
      event.preventDefault()
    })
    el.addEventListener('dragleave', (event: any) => {
      event.stopPropagation()
      event.preventDefault()
    })
    el.addEventListener('drop', (event: any) => {
      event.stopPropagation()
      event.preventDefault()
      binding.value(event)
    })
  }
}
