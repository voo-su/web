import { cookie } from './storage/cookie-storage'
import { accessToken } from '@/constants/default'

export const isLoggedIn = () => {
  return getAccessToken() != ''
}

export const getAccessToken = () => {
  return cookie.get(accessToken) || ''
}

export const setAccessToken = (token = '', expire: number): void => {
  cookie.set(accessToken, token, expire)
}

export const delAccessToken = () => {
  cookie.remove(accessToken)
}
