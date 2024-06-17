export const authSessionKey = 'voo_su_auth_session'
export const authSessionTimerKey = 'voo_su_auth_timer'

export const accessToken = 'voo_su_access_token'
export const userInfo = 'voo_su_user'

export const genderOptions = [

  {
    label: 'Мужской',
    value: '1'
  },
  {
    label: 'Женский',
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
