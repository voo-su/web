import { get, post } from '@/utils/request'
import type {
  IClearUnreadChatApi,
  ICreateChatApi,
  IDeleteChatApi,
  ISetNotDisturbApi,
  ITopChatApi
} from '@/api/types/chat'

export const chatsApi = () => get('/v1/chats')

export const createChatApi = (data: ICreateChatApi) => post('/v1/chats/create', data)

export const deleteChatApi = (data: IDeleteChatApi) => post('/v1/chats/delete', data)

export const topChatApi = (data: ITopChatApi) => post('/v1/chats/topping', data)

export const clearUnreadChatApi = (data: IClearUnreadChatApi) => post('/v1/chats/unread/clear', data)

export const setNotDisturbApi = (data: ISetNotDisturbApi) => post('/v1/chats/disturb', data)
