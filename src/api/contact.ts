import { get, post } from '@/utils/request'

export const getContactListApi = () => get('/v1/contacts')

interface ICreateContactApi {
    friend_id: number
    //remark: string
}

export const createContactApi = (data: ICreateContactApi) => post('/v1/contacts/requests/create', data)

export const getContactApplyRecordsApi = () => get('/v1/contacts/requests')

export const applyAcceptApi = (data: any) => post('/v1/contacts/requests/accept', data)

export const applyDeclineApi = (data: any) => post('/v1/contacts/requests/decline', data)

export const findFriendApplyNumApi = () => get('/v1/contacts/requests/unread-num')

export const searchUserApi = (data: any) => get('/v1/contacts/get', data)

export const deleteContactApi = (data: any) => post('/v1/contacts/delete', data)

// export const editContactRemarkApi = (data: any) => post('/v1/contacts/edit-remark', data)

export const contactFoldersApi = (): any => get('/v1/contacts/folders')

export const contactFolderSaveApi = (data: any) => post('/v1/contacts/folders', data)

export const contactFolderMoveApi = (data: any) => post('/v1/contacts/folders/move', data)
