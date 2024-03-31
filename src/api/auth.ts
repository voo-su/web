import { post } from '@/utils/request'

export const loginApi = data => post('/v1/auth/login', data)

export const verifyApi = data => post('/v1/auth/verify', data)

export const logoutApi = () => post('/v1/auth/logout')
