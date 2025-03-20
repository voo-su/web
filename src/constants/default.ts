import { i18n } from '@/utils/i18n'

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
