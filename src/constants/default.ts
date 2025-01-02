// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { i18n } from '@/utils/i18n'

const t = i18n()

export const authSessionKey: string = 'voo_su_auth_session'
export const authSessionTimerKey: string = 'voo_su_auth_timer'

export const accessToken: string = 'voo_su_access_token'
export const userInfo: string = 'voo_su_user'

export const genderOptions = [
  {
    label: t('maleOption'),
    value: '1'
  },
  {
    label: t('femaleOption'),
    value: '2'
  }
]

export const logo = new URL(
  `../assets/image/logo.svg`,
  import.meta.url
).href

export const defAvatar = new URL(
  `../assets/image/icon-avatar.jpg`,
  import.meta.url
).href

export const notifyIcon = new URL(
  `../assets/image/icon-avatar.jpg`,
  import.meta.url
).href

export const defGroup = new URL(
  `../assets/image/icon-group.svg`,
  import.meta.url
).href
