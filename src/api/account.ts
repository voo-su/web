import { get, put, post } from '@/utils/request'
import type { IUpdateUserDetailApi, IUpdateUsernameApi, IPushInit } from '@/api/types/account'

export const getAccountApi = () => get('/v1/account')

export const pushInitApi = (data: IPushInit) => post('/v1/account/push', data)

export const updateUserDetailApi = (data: IUpdateUserDetailApi) => put('/v1/account', data)

export const updateUsernameApi = (data: IUpdateUsernameApi) => put('/v1/account/username', data)
