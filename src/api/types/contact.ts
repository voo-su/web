// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

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
  folder_id: number
}
