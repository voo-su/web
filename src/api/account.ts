import { get, put } from '@/utils/request'

export const getAccountApi = () => get('/v1/account')

export const updateUserDetailApi = (data: any) => put('/v1/account', data)

export const updateUsernameApi = (data: any) => put('/v1/account/username', data)
