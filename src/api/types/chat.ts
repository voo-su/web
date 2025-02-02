export interface ICreateChatApi {
  chat_type: number
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
  chat_type: number
  receiver_id: number
}

export interface ISetNotDisturbApi {
  chat_type: number
  receiver_id: number
  is_disturb: number
}
