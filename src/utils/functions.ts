import { h } from 'vue'
import { ElIcon } from 'element-plus'
import { downloadFile } from '@/api/message'
import { i18n } from '@/utils/i18n'

const t = i18n()

export interface IImageInfo {
  width: number
  height: number
}

export const getImageInfo = (img: any): IImageInfo => {
  const data = {
    width: 0,
    height: 0
  }

  const arr = img.split('_')
  if (arr.length == 1) {
    return data
  }

  let info = arr[arr.length - 1].match(/\d+x\d+/g)
  if (info == null) {
    return data
  }

  info = info[0].split('x')
  return {
    width: parseInt(info[0]),
    height: parseInt(info[1])
  }
}

export const onDownload = async (crId: number, fileName: string = 'unknown') => {
  try {
    downloadFile({cr_id: crId}, {
      headers: {
        'Accept': 'application/octet-stream'
      },
      responseType: 'blob'
    })
      .then((res) => {
          const blobUrl = window.URL.createObjectURL(new Blob([res]))
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = fileName
          link.click()

          window.URL.revokeObjectURL(blobUrl)
      })
  } catch (err) {
    console.error(`${t('error')}:`, err);
  }
}

export const insertText = (obj: any, str: any) => {
  if (document.selection) {
    const sel = document.selection.createRange()
    sel.text = str
  } else if (
    typeof obj.selectionStart === 'number' &&
    typeof obj.selectionEnd === 'number'
  ) {
    let startPos = obj.selectionStart,
      endPos = obj.selectionEnd,
      cursorPos = startPos,
      tmpStr = obj.value
    obj.value =
      tmpStr.substring(0, startPos) +
      str +
      tmpStr.substring(endPos, tmpStr.length)
    cursorPos += str.length
    obj.selectionStart = obj.selectionEnd = cursorPos

    obj.focus()
  } else {
    obj.value += str
  }
}

export const countDownTime = (second: number = 0) => {
  const formate0to9 = (arg: number) => {
    return arg < 10 ? `0${arg}` : arg
  }

  const hours = parseInt((second / 60 / 60) % 24, 10)
  const minutes = parseInt((second / 60) % 60, 10)
  const seconds = parseInt(second % 60, 10)
  return `${formate0to9(hours)}:${formate0to9(minutes)}:${formate0to9(seconds)}`
}

export const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(window.atob(base64)
    .split('')
    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
  return JSON.parse(jsonPayload)
}

export const downloadImage = (src: string, name: string) => {
  const image = new Image()
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context: any = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    const event = new MouseEvent('click')
    a.download = name || 'image.png'
    a.href = url
    a.dispatchEvent(event)
  }
  image.src = src
}

export const renderIcon = (icon: any) => {
  return () => {
    return h(ElIcon, null, { default: () => h(icon) })
  }
}

export const getErrorForField = (field: string, errors: any) => {
  if (!errors && !errors.length) {
    return false
  }

  const filtered = errors.filter((error: any) => {
    return error.path[0] === field
  })

  if (filtered.length) {
    return filtered[0].message
  }
}
