export const objForEach = (obj, fn) => {
  let key = void 0,
    result = void 0
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = fn.call(obj, key, obj[key])
      if (result === false) {
        break
      }
    }
  }
}

export const arrForEach = (fakeArr, fn) => {
  let i = void 0,
    item = void 0,
    result = void 0
  const length = fakeArr.length || 0
  for (i = 0; i < length; i++) {
    item = fakeArr[i]
    result = fn.call(fakeArr, item, i)
    if (result === false) {
      break
    }
  }
}

export const replaceHtmlSymbol = (html: any) => {
  if (html == null) {
    return ''
  }
  return html
    .replace(/</gm, '&lt;')
    .replace(/>/gm, '&gt;')
    .replace(/"/gm, '&quot;')
    .replace(/(\r\n|\r|\n)/g, '<br/>')
}

export const getPasteText = (e: any) => {
  const clipboardData =
    e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)
  let pasteText = void 0
  if (clipboardData == null) {
    pasteText = window.clipboardData && window.clipboardData.getData('text')
  } else {
    pasteText = clipboardData.getData('text/plain')
  }
  return replaceHtmlSymbol(pasteText)
}

export const getPasteHtml = (e, filterStyle, ignoreImg) => {
  const clipboardData =
    e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)
  let pasteText = void 0,
    pasteHtml = void 0
  if (clipboardData == null) {
    pasteText = window.clipboardData && window.clipboardData.getData('text')
  } else {
    pasteText = clipboardData.getData('text/plain')
    pasteHtml = clipboardData.getData('text/html')
  }
  if (!pasteHtml && pasteText) {
    pasteHtml = '<p>' + replaceHtmlSymbol(pasteText) + '</p>'
  }
  if (!pasteHtml) {
    return
  }
  const docSplitHtml = pasteHtml.split('</html>')
  if (docSplitHtml.length === 2) {
    pasteHtml = docSplitHtml[0]
  }
  pasteHtml = pasteHtml.replace(/<(meta|script|link).+?>/gim, '')
  pasteHtml = pasteHtml.replace(/<!--.*?-->/gm, '')
  pasteHtml = pasteHtml.replace(/\s?data-.+?=('|").+?('|")/gim, '')
  if (ignoreImg) {
    pasteHtml = pasteHtml.replace(/<img.+?>/gim, '')
  }
  if (filterStyle) {
    pasteHtml = pasteHtml.replace(/\s?(class|style)=('|").*?('|")/gim, '')
  } else {
    pasteHtml = pasteHtml.replace(/\s?class=('|").*?('|")/gim, '')
  }
  return pasteHtml
}

export const getPasteImgs = (e: any) => {
  const result = []
  const txt = getPasteText(e)
  if (txt) {
    return result
  }
  const clipboardData =
    e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData) || {}
  const { items } = clipboardData
  if (!items) {
    return result
  }
  objForEach(items, (key, value) => {
    const { type } = value
    if (/image/i.test(type)) {
      result.push(value.getAsFile())
    }
  })
  return result
}

export const getDragPasteImg = (e: any) => {
  const result = []
  const dataTransfer =
    e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer) || {}
  const { items } = dataTransfer
  if (!items) {
    return result
  }
  objForEach(items, (key, value) => {
    const { type } = value
    if (/image/i.test(type)) {
      result.push(value.getAsFile())
    }
  })
  return result
}

export const pasteFilter = (e: any) => {
  e.preventDefault()
  let text = null
  if (window.clipboardData && clipboardData.setData) {
    text = window.clipboardData.getData('text')
  } else {
    text = (e.originalEvent || e).clipboardData.getData('text/plain')
  }
  if (document.body.createTextRange) {
    if (document.selection) {
      textRange = document.selection.createRange()
    } else if (window.getSelection) {
      sel = window.getSelection()
      const range = sel.getRangeAt(0)
      const tempEl = document.createElement('span')
      tempEl.innerHTML = '&#FEFF;'
      range.deleteContents()
      range.insertNode(tempEl)
      textRange = document.body.createTextRange()
      textRange.moveToElementText(tempEl)
      tempEl.parentNode.removeChild(tempEl)
    }
    textRange.text = text
    textRange.collapse(false)
    textRange.select()
  } else {
    document.execCommand('insertText', false, text)
  }
}

export const pasteUids = (value: any) => {
  const atids = value.match(/data-atid="\d+"/g)
  return atids
    ? atids.toString().match(/\d+/g).map(value => parseInt(value))
    : []
}
