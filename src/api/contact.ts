import { get, post } from '@/utils/request'

export const getContactListApi = () => get('/v1/contacts')

export const createContactApi = data => post('/v1/contacts/requests/create', data)

export const getContactApplyRecordsApi = () => get('/v1/contacts/requests')

export const applyAcceptApi = data => post('/v1/contacts/requests/accept', data)

export const applyDeclineApi = data => post('/v1/contacts/requests/decline', data)

export const findFriendApplyNumApi = () => get('/v1/contacts/requests/unread-num')

export const searchUserApi = data => get('/v1/contacts/get', data)

export const deleteContactApi = data => post('/v1/contacts/delete', data)

export const contactFoldersApi = () => get('/v1/contacts/folders')

export const contactFolderSaveApi = data => post('/v1/contacts/folders', data)

export const contactFolderMoveApi = data => post('/v1/contacts/folders/move', data)
