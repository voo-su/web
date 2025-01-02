// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { cookie } from './storage/cookie-storage'
import { accessToken } from '@/constants/default'

export const isLoggedIn = () => {
  return getAccessToken() != ''
}

export const getAccessToken = (): string => {
  return cookie.get(accessToken) || ''
}

export const setAccessToken = (token = '', expire: number): void => {
  cookie.set(accessToken, token, expire)
}

export const delAccessToken = (): void => {
  cookie.remove(accessToken)
}
