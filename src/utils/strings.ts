import { i18n } from '@/utils/i18n'

export const trim = (str: string, type = null) => {
  if (type) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  } else if (type == 'l') {
    return str.replace(/(^\s*)/g, '')
  } else {
    return str.replace(/(\s*$)/g, '')
  }
}

export const hidePhone = (phone: string) => phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

export const textReplaceLink = (text: string, color: string = '#409eff') => {
  const exp: RegExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
  return text.replace(exp, `<a href="$1" alt="link" style="color:${color};text-decoration: revert;">$1</a >`)
}

export const textReplaceMention = (text: string, color: string = '#2196F3') => {
  return text.replace(new RegExp(/@\S+/, 'g'), ($0, $1) => `<span style="color:${color};">${$0}</span>`)
}

export const fileFormatSize = (value: string) => {
  if (null == value || value == '') {
    return '0'
  }

  const srcsize = parseFloat(value)
  let index = Math.floor(Math.log(srcsize) / Math.log(1000))
  let size = srcsize / Math.pow(1000, index)

  const unitArr = [i18n('byte'), i18n('kb'), i18n('mb'), i18n('gb'), i18n('tb'), i18n('pb'), i18n('eb'), i18n('zb'), i18n('yb')]
  return size.toFixed(2) + ' ' + unitArr[index]
}

export const fileSuffix = (fileName: string) => {
  const ext = fileName.split('.')
  return ext[ext.length - 1]
}
