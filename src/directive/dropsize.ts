const touch: any = {
  lastTime: 0,
  interval: 300,
  startX: 0
}

let move: number = 0
let element: any
let min: number = 200
let max: number = 230

const mousemove_ = (e: any) => {
  if (!touch.init) return
  move = e.pageX - touch.startX
  element.style.width = touch.width + move + 'px'
  if (touch.width + move > max) {
    element.style.width = max + 'px'
  }
  if (touch.width + move < min) {
    element.style.width = min + 'px'
  }
}

const mouseup_ = () => {
  console.log('mouseup_')
  if (!touch.init) return
  touch.init = false
  document.removeEventListener('mousemove', mousemove_)
  document.removeEventListener('mouseup', mouseup_)
}

export default {
  mounted: (el: any, binding: any) => {
    if (el) {
      element = el
      max = binding.value.max
      min = binding.value.min
      el.style.position = 'relative'
      const dom = document.createElement('DIV')
      dom.style.height = '100%'
      dom.style.width = '3px'
      dom.style.position = 'absolute'
      dom.style.top = '0px'
      dom.style.right = '0px'
      dom.style.cursor = 'col-resize'
      dom.style.backgroundColor = 'transparent'
      dom.style.userSelect = 'none'
      dom.style.touchAction = 'none'
      dom.addEventListener('mousedown', (e: any) => {
        const now = +new Date()
        if (now - touch.lastTime < touch.interval) {
          return (touch.init = false)
        }
        touch.init = true
        touch.startX = e.pageX
        touch.width = el.offsetWidth
        document.addEventListener('mousemove', mousemove_, { passive: false })
        document.addEventListener('mouseup', mouseup_)
      })
      el.appendChild(dom)
    }
  },

  unmounted: () => {
    document.removeEventListener('mousemove', mousemove_)
    document.removeEventListener('mouseup', mouseup_)
  }
}
