export interface ICreateProjectApi {
  title: string
  ids: string
}

export interface IDetailApi {
  id: string
}

export interface IMembersApi {
  project_id: string
}

export interface IInviteFriendsApi {
  project_id: string | undefined
}
