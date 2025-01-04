export default {
  created(el: any, binding: any, vnode: any) {
    el.addEventListener('copy', function(event: any) {
      binding.value(event)
    })
  }
}
