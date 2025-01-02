// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

export default {
  created(el: any, binding: any) {
    el.addEventListener('paste', (event: any) => {
      binding.value(event)
    })
  }
}
