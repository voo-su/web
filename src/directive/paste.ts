export default {
  created(el, binding) {
    el.addEventListener('paste', event => {
      binding.value(event)
    })
  }
}
