export interface TextExtra {
  lang: string
  code: string
}

export interface CodeExtra {
  lang: string
  code: string
}

export interface FileExtra {
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

export interface Data {
  float: string
  content: string
}

export interface GroupAdsExtra {
  owner_id: number
  owner_name: string
  title: number
  content: string
}

export interface MixedExtra {
  items: {
    type: number
    content: string
    link: string
  }[]
}

export interface VideoExtra {
  cover: string
  url: string
  duration: number
  size: number
}
