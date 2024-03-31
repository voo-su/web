interface Item {
  type: number
  content: string
}

interface AnalysisResp {
  items: Item[]
  mentions: any[]
  mentionUids: number[]
  quoteId: string
  msgType: number
}

function removeLeadingNewlines(str) {
  return str.replace(/^[\n\s]+/, '')
}

function removeTrailingNewlines(str) {
  return str.replace(/[\n\s]+$/, '')
}

export function getEditorNodeInfo(editor: HTMLElement | null): AnalysisResp {
  const resp: AnalysisResp = {
    items: [],
    mentions: [],
    mentionUids: [],
    quoteId: '',
    msgType: 1
  }

  const nodes = editor ? editor.childNodes : []

  for (const node of nodes) {
    let preNode
    if (resp.items.length) {
      preNode = resp.items[resp.items.length - 1]
    }

    if (node.nodeName == '#text') {
      if (!node.textContent) continue
      if (preNode && preNode.type == 1) {
        preNode.content = preNode.content + node.textContent
        continue
      }
      resp.items.push({
        'type': 1,
        'content': node.textContent
      })
      continue
    }
    if (node.nodeName == 'IMG' && node.className == 'el-emoji') {
      if (preNode && preNode.type == 1) {
        preNode.content = preNode.content + node.dataset.text
        continue
      }
      resp.items.push({
        'type': 1,
        'content': node.dataset.text
      })
      continue
    }

    if (node.nodeName == 'SPAN' && node.className == 'tribute-mention') {
      resp.mentions.push({
        'name': node.textContent,
        'atid': Number(node.dataset.atid)
      })
      if (preNode && preNode.type == 1) {
        preNode.content = preNode.content + node.textContent
        continue
      }
      resp.items.push({
        'type': 1,
        'content': node.textContent || ''
      })
      continue
    }

    if (node.nodeName == 'IMG' && node.className == 'message-input-image') {
      resp.items.push({
        'type': 3,
        'content': node.currentSrc
      })
      continue
    }

    if (node.nodeName == 'DIV' && node.className == 'quote-card') {
      resp.quoteId = node.dataset.id
    }
  }

  if (resp.items.length) {
    if (resp.items[0].type == 1) {
      resp.items[0].content = removeLeadingNewlines(resp.items[0].content)
    }

    if (resp.items[resp.items.length - 1].type == 1) {
      resp.items[resp.items.length - 1].content = removeTrailingNewlines(resp.items[resp.items.length - 1].content)
    }
  }

  if (resp.items.length > 1) {
    resp.msgType = 12
  }

  if (resp.items.length == 1) {
    resp.msgType = resp.items[0].type
  }

  resp.mentionUids = resp.mentions.map(item => item.atid)

  return resp
}
