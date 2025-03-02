import { cookie } from './storage/cookie-storage'
import { ACCESS_TOKEN } from '@/constants/default'

export const isLoggedIn = () => {
  return getAccessToken() != ''
}

export const getAccessToken = (): string => {
  return cookie.get(ACCESS_TOKEN) || ''
}

export const setAccessToken = (token = '', expire: number): void => {
  cookie.set(ACCESS_TOKEN, token, expire)
}

export const delAccessToken = (): void => {
  cookie.remove(ACCESS_TOKEN)
}
