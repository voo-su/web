export const trim = (str, type = null) => {
  if (type) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  } else if (type == 'l') {
    return str.replace(/(^\s*)/g, '')
  } else {
    return str.replace(/(\s*$)/g, '')
  }
}

export const hidePhone = phone => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export const textReplaceLink = (text, color = '#409eff') => {
  const exp =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi

  return text.replace(
    exp,
    `<a href="$1" alt="link" style="color:${color};text-decoration: revert;">$1</a >`
  )
}

export const textReplaceMention = (text, color = '#2196F3') => {
  return text.replace(new RegExp(/@\S+/, 'g'), ($0, $1) => {
    return `<span style="color:${color};">${$0}</span>`
  })
}

export const fileFormatSize = value => {
  if (null == value || value == '') {
    return '0'
  }

  const unitArr = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЭБ', 'ЗБ', 'ИБ']
  let index = 0
  const srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1000))
  let size = srcsize / Math.pow(1000, index)
  size = size.toFixed(2)

  return size + ' ' + unitArr[index]
}

export const fileSuffix = fileName => {
  const ext = fileName.split('.')

  return ext[ext.length - 1]
}
