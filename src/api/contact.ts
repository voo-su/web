import { get, post } from '@/utils/request'
import type {
  IApplyAcceptApi,
  IApplyDeclineApi,
  IContactFolderMoveApi,
  IContactFolderSaveApi,
  ICreateContactApi,
  IDeleteContactApi,
  ISearchUserApi
} from '@/api/types/contact'

export const getContactListApi = () => get('/v1/contacts')

export const createContactApi = (data: ICreateContactApi) => post('/v1/contacts/requests', data)

export const getContactApplyMessagesApi = () => get('/v1/contacts/requests')

export const applyAcceptApi = (data: IApplyAcceptApi) => post('/v1/contacts/requests/accept', data)

export const applyDeclineApi = (data: IApplyDeclineApi) => post('/v1/contacts/requests/decline', data)

export const findFriendApplyNumApi = () => get('/v1/contacts/requests/unread-num')

export const searchUserApi = (data: ISearchUserApi) => get('/v1/contacts/get', data)

export const deleteContactApi = (data: IDeleteContactApi) => post('/v1/contacts/delete', data)

export const contactFoldersApi = (): any => get('/v1/contacts/folders')

export const contactFolderSaveApi = (data: IContactFolderSaveApi) => post('/v1/contacts/folders', data)

export const contactFolderMoveApi = (data: IContactFolderMoveApi) => post('/v1/contacts/folders/move', data)
