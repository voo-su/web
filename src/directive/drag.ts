export default {
  created(el, binding) {
    el.addEventListener('dragenter', event => {
      event.stopPropagation()
      event.preventDefault()
    })
    el.addEventListener('dragover', event => {
      event.stopPropagation()
      event.preventDefault()
    })
    el.addEventListener('dragleave', event => {
      event.stopPropagation()
      event.preventDefault()
    })
    el.addEventListener('drop', event => {
      event.stopPropagation()
      event.preventDefault()
      binding.value(event)
    })
  }
}
