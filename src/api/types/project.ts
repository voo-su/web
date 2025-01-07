export interface ICreateProjectApi {
  title: string
  ids: string
}

export interface IDetailApi {
  id: number
}

export interface IMembersApi {
  project_id: number
}

export interface IInviteFriendsApi {
  project_id: number | undefined
}
