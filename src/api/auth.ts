import { post } from '@/utils/request'

interface ILoginApi {
    email: string
    platform: string
}

export const loginApi = (data: ILoginApi) => post('/v1/auth/login', data)

interface IVerifyApi {
    token: string,
    code: string
}

export const verifyApi = (data: IVerifyApi) => post('/v1/auth/verify', data)

export const logoutApi = () => post('/v1/auth/logout')
