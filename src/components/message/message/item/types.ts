// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

export interface ITextExtra {
  lang: string
  code: string
}

export interface IFileExtra {
  drive: number
  name: string
  path: string
  suffix: string
  size: number
}

export interface ForwardExtra {
  msg_ids: number[]
  receiver_id: number
  records: {
    username: string
    text: string
  }[]
  dialog_type: number
  user_id: number
}

export interface IData {
  float: string
  content: string
}

export interface IGroupAdsExtra {
  owner_id: number
  owner_name: string
  title: number
  content: string
}

export interface IMixedExtra {
  items: {
    type: number
    content: string
    link: string
  }[]
}

export interface IVideoExtra {
  cover: string
  url: string
  duration: number
  size: number
}
