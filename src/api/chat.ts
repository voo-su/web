import { get, post } from '@/utils/request'

export const chatsApi = (data = {}) => get('/v1/chat/list', data)

export const createChatApi = (data = {}) => post('/v1/chat/create', data)

export const delChatApi = (data = {}) => post('/v1/chat/delete', data)

export const topChatApi = (data = {}) => post('/v1/chat/topping', data)

export const clearUnreadChatApi = (data = {}) => post('/v1/chat/unread/clear', data)

export const setNotDisturbApi = (data = {}) => post('/v1/chat/disturb', data)
