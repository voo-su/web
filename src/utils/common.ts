// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { createApp } from 'vue'
import { ElMessage } from 'element-plus'
import { i18n } from '@/utils/i18n'

const t = i18n()

export const debounce = (fn: any, delay: any) => {
  let timer: any = null
  return function () {
    timer && clearTimeout(timer)
    const content = this
    const args = arguments
    timer = setTimeout(() => {
      fn.apply(content, args)
    }, delay)
  }
}

export const throttle = (fn: any, delay: any, call = () => {}) => {
  let lastTime = 0
  return function () {
    const now = new Date().getTime()
    if (now - lastTime > delay) {
      lastTime = now
      fn.apply(this, arguments)
    } else {
      call()
    }
  }
}

export const clipboard = (text: any, callback: any) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      callback && callback()
    })
    .catch(() => {
      ElMessage.info(t('clipboardAccessDenied'))
    })
}

export const clipboardImage = async (src: any, callback: any) => {
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
    const context: any = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    canvas.toBlob(async (blob: any) => {
      try {
        const item = new ClipboardItem({
          [blob.type]: blob
        })
        await navigator.clipboard.write([item])
        callback()
      } catch (err: any) {
        ElMessage.info(t('imageCopyError', { err: err }))
      }
    }, 'image/png')
  }
}

export const emitCall = (event: any, data: any, fn: any) => {
  return {
    event: event,
    data: data,
    callBack: fn || function () {
    }
  }
}

export const modal = (constructor: any, props: any = {}, close: () => void) => {
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  const app = createApp(constructor, {
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
  const htmlEntityMap: any = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#39;': '\'',
    '&quot;': '"',
    '&nbsp;': ' ',
    '&copy;': '\u00A9',
    '&reg;': '\u00AE'
  }

  return input.replace((htmlEntities: any, match: any) => {
    return htmlEntityMap[match] || match
  })
}

export function getVideoImage(file: any) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = URL.createObjectURL(file)
    video.addEventListener('loadeddata', function () {
      this.currentTime = 1
    })

    video.addEventListener('seeked', function () {
      this.width = this.videoWidth
      this.height = this.videoHeight

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = this.width
      canvas.height = this.height
      ctx?.drawImage(this, 0, 0, canvas.width, canvas.height)

      const image: any = {
        url: canvas.toDataURL('image/jpeg', 1),
        width: this.width,
        height: this.height,
        duration: this.duration
      }

      canvas.toBlob(function (blob: any) {
        image.file = new File([blob], 'video_image.jpeg', {
          type: blob?.type,
          lastModified: Date.now()
        })
        resolve(image)
      }, 'image/jpeg')
    })
  })
}
