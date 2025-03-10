import { get, post, upload } from '@/utils/request'
import type {
  IClearUnreadChatApi,
  ICreateChatApi,
  IDeleteChatApi,
  ISetNotDisturbApi,
  ITopChatApi,
  ICollectStickerApi,
  IConfirmVoteHandleApi,
  IDeleteStickerApi,
  IMessagesApi,
  IForwardMessagesApi,
  IGetForwardMessagesApi,
  ISendMessageApi,
  IRemoveMessagesApi,
  IRevokeMessagesApi,
  ISendVoteApi,
  IDownloadFileApi,
} from '@/api/types/chat'

export const chatsApi = () => get('/v1/chats')

export const createChatApi = (data: ICreateChatApi) => post('/v1/chats/create', data)

export const deleteChatApi = (data: IDeleteChatApi) => post('/v1/chats/delete', data)

export const topChatApi = (data: ITopChatApi) => post('/v1/chats/topping', data)

export const clearUnreadChatApi = (data: IClearUnreadChatApi) => post('/v1/chats/unread/clear', data)

export const setNotDisturbApi = (data: ISetNotDisturbApi) => post('/v1/chats/disturb', data)

export const getMessagesApi = (data: IMessagesApi) => get('/v1/chats/messages', data)

export const sendMessageApi = (data: ISendMessageApi) => post('/v1/chats/messages/send', data)

export const revokeMessagesApi = (data: IRevokeMessagesApi) => post('/v1/chats/messages/revoke', data)

export const removeMessagesApi = (data: IRemoveMessagesApi) => post('/v1/chats/messages/delete', data)

export const sendVoteApi = (data: ISendVoteApi) => post('/v1/chats/messages/vote', data)

export const confirmVoteHandleApi = (data: IConfirmVoteHandleApi) => post('/v1/chats/messages/vote/handle', data)

export const getStickerListApi = () => get('/v1/chats/messages/stickers')

export const uploadStickerApi = (data: FormData) => upload('/v1/chats/messages/stickers', data)

export const deleteStickerApi = (data: IDeleteStickerApi) => post('/v1/chats/messages/stickers/delete', data)

export const collectStickerApi = (data: ICollectStickerApi) => post('/v1/chats/messages/collect', data)

export const forwardMessagesApi = (data: IForwardMessagesApi) => post('/v1/chats/messages/forward', data)

export const getForwardMessagesApi = (data: IGetForwardMessagesApi) => get('/v1/chats/messages/forward/list', data)

export const downloadFile = (data: IDownloadFileApi, options = {}) => get('/v1/chats/messages/file/download', data, options)
