export interface ILoginApi {
    email: string
    platform: string
}

export interface IVerifyApi {
  token: string
  code: string
}
