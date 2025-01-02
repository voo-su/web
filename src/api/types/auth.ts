// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

export interface ILoginApi {
    email: string
    platform: string
}

export interface IVerifyApi {
  token: string
  code: string
}
