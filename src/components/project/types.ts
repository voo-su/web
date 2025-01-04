export interface ICoexecutorItem {
  id: number
  username: string
}

export interface IWatcherItem {
  id: number
  username: string
}

export interface ICommentItem {
  id: number
  comment: string
  user: {
    avatar: string
    username: string
    name: string
    surname: string
  }
  created_at: string
  index_name: string
}
