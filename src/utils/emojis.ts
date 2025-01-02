// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

const emojis = [
  '😠',
  '😩',
  '😲',
  '😞',
  '😵',
  '😰',
  '😒',
  '😍',
  '😤',
  '😜',
  '😝',
  '😋',
  '😘',
  '😚',
  '😷',
  '😳',
  '😃',
  '😅',
  '😆',
  '😁',
  '😂',
  '😊',
  '😄',
  '😢',
  '😭',
  '😨',
  '😣',
  '😡',
  '😌',
  '😖',
  '😔',
  '😱',
  '😪',
  '😏',
  '😓',
  '😥',
  '😫',
  '😉',
  '✊',
  '✋',
  '✌',
  '👊',
  '👍',
  '☝',
  '👆',
  '👇',
  '👈',
  '👉',
  '👋',
  '👏',
  '👌',
  '👎'
]

export const emojiList = { emojis }

export const textReplaceEmoji = (content: any) => {
  return content.replace(new RegExp(`(${emojis})`, 'gi'), ($0: any, $1: any) => {
    return emojis[$1]
  })
}
