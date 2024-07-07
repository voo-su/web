export default {
  created(el: any, binding: any) {
    el.addEventListener('paste', (event: any) => {
      binding.value(event)
    })
  }
}
