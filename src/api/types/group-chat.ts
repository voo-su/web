export interface IGroupDetailApi {
  group_id: number
}

export interface ICreateGroupApi {
  avatar: string
  name: string
  description: string
  ids: string
}

export interface IEditGroupApi {
  group_id: number
  group_name: string
  avatar: string
  description: string
}

export interface IInviteGroupApi {
  group_id: number
  ids: string
}

export interface ISecedeGroupApi {
  group_id: number
}

export interface IGetGroupMembersApi {
  group_id: number
}

export interface IRemoveMembersGroupApi {
  group_id: number
  members_ids: string
}

export interface IGetInviteFriendsApi {
  group_id: number
}

export interface IGroupAssignAdminApi {
  mode: number
  group_id: number
  user_id: number
}

export interface IDismissGroupApi {
  group_id: number
}

export interface IGroupHandoverApi {
  group_id: number
  user_id: number
}

export interface IGroupNoSpeakApi {
  mode: number
  group_id: number
  user_id: number
}

export interface IMuteGroupApi {
  group_id: number
  mode: number
}

export interface IOvertGroupApi {
  group_id: number
  mode: number
}

export interface ICreateGroupRequestsApi {
  group_id: number
}

export interface IGetGroupRequestsApi {
  group_id: number
}

export interface IDeleteGroupApplyApi {
  apply_id: number
}

export interface IAgreeGroupApplyApi {
  apply_id: number
}

export interface IGetGroupAdsApi {
  group_id: number
}

export interface IEditGroupAdsApi {
  ads_id: number
  group_id: number
  title: string
  content: string
  is_top: number
  is_confirm: number
}

