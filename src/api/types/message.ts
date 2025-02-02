export interface IRecordsApi {
  record_id: number
  receiver_id: number
  chat_type: number
  limit: number
}

export interface IMessageSendApi {
  type: string
  receiver: {
    chat_type: number
    receiver_id: number
  }
}

export interface IRevokeRecordsApi {
  msg_id: string
}

export interface IRemoveRecordsApi {
  chat_type: number
  receiver_id: number
  record_id: string
}

export interface ISendVoteApi {
  receiver_id: number
  mode: number
  anonymous: number
  title: string
  options: any
}

export interface IConfirmVoteHandleApi {
  record_id: number
  options: any
}

export interface IDeleteStickerApi {
  ids: string
}

export interface ICollectStickerApi {
  record_id: number
}

export interface IForwardRecordsApi {
  chat_type: number
  receiver_id: number
  forward_mode: number
  records_ids: string
  receive_user_ids: string
  receive_group_ids: string
}

export interface IGetForwardRecordsApi {
  pid: string
  record_id: number
}

export interface IDownloadFileApi {
  cr_id: number
}


