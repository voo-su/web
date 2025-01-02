// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

export interface ICreateChatApi {
  dialog_type: number
  receiver_id: number
}

export interface IDeleteChatApi {
  list_id: number
}

export interface ITopChatApi {
  list_id: number
  type: number
}

export interface IClearUnreadChatApi {
  dialog_type: number
  receiver_id: number
}

export interface ISetNotDisturbApi {
  dialog_type: number
  receiver_id: number
  is_disturb: number
}
