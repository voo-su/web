import { get, put } from '@/utils/request'

export const getAccountSettingApi = () => get('/v1/account/get')

export const getAccountDetailApi = () => get('/v1/account/detail')

export const updateUserDetailApi = data => put('/v1/account/detail', data)

export const updateUsernameApi = data => put('/v1/account/username', data)
