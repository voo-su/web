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
