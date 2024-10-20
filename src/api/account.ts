import { get, put } from '@/utils/request'
import type { IUpdateUserDetailApi, IUpdateUsernameApi } from '@/api/types/account'

export const getAccountApi = () => get('/v1/account')

export const updateUserDetailApi = (data: IUpdateUserDetailApi) => put('/v1/account', data)

export const updateUsernameApi = (data: IUpdateUsernameApi) => put('/v1/account/username', data)
