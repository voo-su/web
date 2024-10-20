export interface IDialogRecordsApi {
  record_id: number
  receiver_id: number
  dialog_type: number
  limit: number
}

export interface IPublishMessageApi {
  type: string
  receiver: {
    receiver_id: number
    dialog_type: number
  }
}

export interface ISendDialogFileApi {
  upload_id: number
  receiver_id: number
  dialog_type: number
}

export interface IRevokeRecordsApi {
  msg_id: string
}

export interface IRemoveRecordsApi {
  dialog_type: number
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
  dialog_type: number
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

export interface ISendDialogTextApi {
  dialog_type: number
  receiver_id: number
  text: string
}
