export interface ICreateContactApi {
  friend_id: number
}

export interface IApplyAcceptApi {
  apply_id: number
}

export interface IApplyDeclineApi {
  apply_id: number
}

export interface ISearchUserApi {
  user_id: number
}

export interface IDeleteContactApi {
  friend_id: number
}

export interface IEditContactRemarkApi {
  friend_id: number
  remark: string
}

export interface IContactFolderSaveApi {
  items: any
}

export interface IContactFolderMoveApi {
  user_id: number
  group_id: number
}
