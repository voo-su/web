import { get, post } from '@/utils/request'

export const chatsApi = (data = {}) => get('/v1/chats', data)

export const createChatApi = (data = {}) => post('/v1/chats/create', data)

export const delChatApi = (data = {}) => post('/v1/chats/delete', data)

export const topChatApi = (data = {}) => post('/v1/chats/topping', data)

export const clearUnreadChatApi = (data = {}) => post('/v1/chats/unread/clear', data)

export const setNotDisturbApi = (data = {}) => post('/v1/chats/disturb', data)
