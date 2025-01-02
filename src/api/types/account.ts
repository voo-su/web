// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

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
