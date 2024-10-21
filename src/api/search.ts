import { get } from '@/utils/request'
import type { ISearchUserApi, ISearchGroupApi } from '@/api/types/search'

export const searchUsersApi = (data: ISearchUserApi) => get('/v1/search/users', data)

export const searchGroupsApi = (data: ISearchGroupApi) => get('/v1/search/group-chats', data)
