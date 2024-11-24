export interface IUpdateUserDetailApi {
  avatar: string
  name: string
  surname: string
  gender: string
  birthday: string
  about: string
}

export interface IUpdateUsernameApi {
  username: string
}

export interface IPushInit {
  subscription: string
}
