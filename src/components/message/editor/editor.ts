interface IItem {
  type: number
  content: string
}

interface IAnalysisResp {
  items: IItem[]
  mentions: any[]
  mentionUids: number[]
  quoteId: string
  msgType: number
}

const removeLeadingNewlines = (str: string) => str.replace(/^[\n\s]+/, '')
const removeTrailingNewlines = (str: string) => str.replace(/[\n\s]+$/, '')

export const getEditorNodeInfo = (editor: HTMLElement | null): IAnalysisResp => {
  const resp: IAnalysisResp = {
    items: [],
    mentions: [],
    mentionUids: [],
    quoteId: '',
    msgType: 1
  }

  const nodes: any = editor ? editor.childNodes : []

  const appendTextContent = (content: string) => {
    const lastItem = resp.items[resp.items.length - 1]
    if (lastItem && lastItem.type === 1) {
      lastItem.content += content
    } else {
      resp.items.push({
        type: 1,
        content
      })
    }
  }

  for (const node of nodes) {
    if (node.nodeName === '#text') {
      if (!node.textContent) continue

      const parts = node.textContent.split('\n')
      parts.forEach((part, index) => {
        appendTextContent(part)
        if (index < parts.length - 1) {
          // Перенос строки после каждой части, кроме последней
          appendTextContent('\n')
        }
      })
      continue
    }

    if (node.nodeName === 'BR') {
      appendTextContent('\n')
      continue
    }

    if (node.nodeName === 'IMG' && node.className === 'el-emoji') {
      appendTextContent(node.dataset.text)
      continue
    }

    if (node.nodeName === 'SPAN' && node.className === 'tribute-mention') {
      resp.mentions.push({
        name: node.textContent,
        atid: Number(node.dataset.atid)
      })
      appendTextContent(node.textContent || '')
      continue
    }

    if (node.nodeName === 'IMG' && node.className === 'message-input-image') {
      resp.items.push({
        type: 3,
        content: node.currentSrc
      })
      continue
    }

    if (node.nodeName === 'DIV' && node.className === 'quote-card') {
      resp.quoteId = node.dataset.id
    }
  }

  if (resp.items.length) {
    if (resp.items[0].type === 1) {
      resp.items[0].content = removeLeadingNewlines(resp.items[0].content)
    }

    if (resp.items[resp.items.length - 1].type === 1) {
      resp.items[resp.items.length - 1].content = removeTrailingNewlines(resp.items[resp.items.length - 1].content)
    }
  }

  if (resp.items.length > 1) {
    resp.msgType = 12
  }

  if (resp.items.length === 1) {
    resp.msgType = resp.items[0].type
  }

  resp.mentionUids = resp.mentions.map(item => item.atid)

  return resp
}
