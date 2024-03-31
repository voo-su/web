import { createApp } from 'vue'

export const debounce = (fn, delay) => {
  let timer = null
  return function() {
    timer && clearTimeout(timer)
    const content = this
    const args = arguments
    timer = setTimeout(() => {
      fn.apply(content, args)
    }, delay)
  }
}

export const throttle = (fn, delay, call = function() {
}) => {
  let lastTime = 0
  return function() {
    const now = new Date().getTime()
    if (now - lastTime > delay) {
      lastTime = now
      fn.apply(this, arguments)
    } else {
      call()
    }
  }
}

export function clipboard(text, callback) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      callback && callback()
    })
    .catch(() => {
      window['$message'].info('Нет разрешения на доступ к буферу обмена.')
    })
}

export async function clipboardImage(src, callback) {
  const { state } = await navigator.permissions.query({
    name: 'clipboard-write'
  })
  if (state != 'granted') {
    return
  }
  const image = new Image()
  image.src = src
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    canvas.toBlob(async blob => {
      try {
        const item = new ClipboardItem({
          [blob.type]: blob
        })
        await navigator.clipboard.write([item])
        callback()
      } catch (err) {
        window['$message'].info('Ошибка при копировании изображения: ', err)
      }
    }, 'image/png')
  }
}


export const emitCall = (event, data, fn) => {
  return {
    event: event,
    data: data,
    callBack: fn || function() {
    }
  }
}

export const modal = (Constructor, props = {}, close: () => void) => {
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  const app = createApp(Constructor, {
    ...props,
    remove() {
      mountNode.remove()
      close()
      app.unmount(mountNode)
    }
  })
  return app.mount(mountNode, true)
}

export const htmlDecode = (input: any) => {
  const htmlEntities = /&(?:[a-z]+|#\d+);/gi
  const htmlEntityMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#39;': '\'',
    '&quot;': '"',
    '&nbsp;': ' ',
    '&copy;': '\u00A9',
    '&reg;': '\u00AE'
  }
  return input.replace(htmlEntities, match => {
    return htmlEntityMap[match] || match
  })
}

export function getVideoImage(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = URL.createObjectURL(file)
    video.addEventListener('loadeddata', function() {
      this.currentTime = 1
    })
    video.addEventListener('seeked', function() {
      this.width = this.videoWidth
      this.height = this.videoHeight
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = this.width
      canvas.height = this.height
      ctx?.drawImage(this, 0, 0, canvas.width, canvas.height)
      const image = {
        url: canvas.toDataURL('image/jpeg', 1),
        width: this.width,
        height: this.height,
        duration: this.duration
      }
      canvas.toBlob(function(blob) {
        image.file = new File([blob], 'video_image.jpeg', {
          type: blob.type,
          lastModified: Date.now()
        })
        resolve(image)
      }, 'image/jpeg')
    })
  })
}
