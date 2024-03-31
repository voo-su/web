export default {
  created(el, binding, vnode) {
    el.addEventListener('copy', function(event) {
      binding.value(event)
    })
  }
}
