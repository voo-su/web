import { get, post } from '@/utils/request'

export const getContactListApi = data => get('/v1/contact/list', data)

export const createContactApi = data => post('/v1/contact/request/create', data)

export const getContactApplyRecordsApi = () => get('/v1/contact/request/records')

export const applyAcceptApi = data => post('/v1/contact/request/accept', data)

export const applyDeclineApi = data => post('/v1/contact/request/decline', data)

export const findFriendApplyNumApi = () => get('/v1/contact/request/unread-num')

export const searchUserApi = data => get('/v1/contact/detail', data)
