import { i18n } from '@/utils/i18n'

export const AUTH_SESSION_KEY: string = 'voo_su_auth_session'
export const AUTH_SESSION_TIMER_KEY: string = 'voo_su_auth_timer'

export const ACCESS_TOKEN: string = 'voo_su_access_token'
export const USER_INFO: string = 'voo_su_user'

export const PUSH_STORAGE_KEY = 'voo_su_push_subscription'
export const PUSH_TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000

export const GENDER_OPTIONS = [
  {
    label: i18n('maleOption'),
    value: '1'
  },
  {
    label: i18n('femaleOption'),
    value: '2'
  }
]

export const LOGO_ICON = new URL(
  `../assets/image/logo.svg`,
  import.meta.url
).href

export const AVATAR_ICON = new URL(
  `../assets/image/icon-avatar.jpg`,
  import.meta.url
).href

export const NOTIFY_ICON = new URL(
  `../assets/image/icon-avatar.jpg`,
  import.meta.url
).href

export const GROUP_ICON = new URL(
  `../assets/image/icon-group.svg`,
  import.meta.url
).href
