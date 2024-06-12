import { get, put } from '@/utils/request'

export const getAccountApi = () => get('/v1/account')

export const updateUserDetailApi = data => put('/v1/account', data)

export const updateUsernameApi = data => put('/v1/account/username', data)
