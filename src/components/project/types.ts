export interface ITask {
  id: number
  title: string
  description: string
  created_at: string
  assigner: IMemberItem
  executor: IMemberItem
}

export interface IMemberItem {
  id: number
  avatar: string
  username: string
  name: string
  surname: string
}

export interface ICommentItem {
  id: number
  comment: string
  user: IMemberItem
  created_at: string
  index_name: string
}
