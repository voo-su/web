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

export interface IMessagesApi {
  message_id: number
  receiver_id: number
  chat_type: number
  limit: number
}

export interface ISendMessageApi {
  type: string
  receiver: {
    chat_type: number
    receiver_id: number
  }
}

export interface IRevokeMessagesApi {
  msg_id: string
}

export interface IRemoveMessagesApi {
  chat_type: number
  receiver_id: number
  msg_ids: string
}

export interface ISendVoteApi {
  receiver_id: number
  mode: number
  anonymous: number
  title: string
  options: any
}

export interface IConfirmVoteHandleApi {
  message_id: number
  options: any
}

export interface IDeleteStickerApi {
  ids: string
}

export interface ICollectStickerApi {
  message_id: number
}

export interface IForwardMessagesApi {
  chat_type: number
  receiver_id: number
  forward_mode: number
  messages_ids: string
  receive_user_ids: string
  receive_group_ids: string
}

export interface IGetForwardMessagesApi {
  pid: string
  message_id: number
}

export interface IDownloadFileApi {
  cr_id: number
}
