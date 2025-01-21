import { get, post, upload } from '@/utils/request'
import type {
  ICollectStickerApi,
  IConfirmVoteHandleApi,
  IDeleteStickerApi,
  IRecordsApi,
  IForwardRecordsApi,
  IGetForwardRecordsApi,
  IMessageSendApi,
  IRemoveRecordsApi,
  IRevokeRecordsApi,
  ISendVoteApi,
  IDownloadFileApi,
} from '@/api/types/message'

export const getRecordsApi = (data: IRecordsApi) => get('/v1/messages', data)

export const messageSendApi = (data: IMessageSendApi) => post('/v1/messages/send', data)

export const revokeRecordsApi = (data: IRevokeRecordsApi) => post('/v1/messages/revoke', data)

export const removeRecordsApi = (data: IRemoveRecordsApi) => post('/v1/messages/delete', data)

export const sendVoteApi = (data: ISendVoteApi) => post('/v1/messages/vote', data)

export const confirmVoteHandleApi = (data: IConfirmVoteHandleApi) => post('/v1/messages/vote/handle', data)

export const getStickerListApi = () => get('/v1/messages/stickers')

export const uploadStickerApi = (data: FormData) => upload('/v1/messages/stickers', data)

export const deleteStickerApi = (data: IDeleteStickerApi) => upload('/v1/messages/stickers/delete', data)

export const collectStickerApi = (data: ICollectStickerApi) => post('/v1/messages/collect', data)

export const forwardRecordsApi = (data: IForwardRecordsApi) => post('/v1/messages/forward', data)

export const getForwardRecordsApi = (data: IGetForwardRecordsApi) => get('/v1/messages/forward/list', data)

export const downloadFile = (data: IDownloadFileApi, options = {}) => get('/v1/messages/file/download', data, options)
