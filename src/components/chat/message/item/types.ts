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
  messages: {
    username: string
    text: string
  }[]
  chat_type: number
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
