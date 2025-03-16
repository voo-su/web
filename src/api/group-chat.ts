import { get, post } from '@/utils/request'
import type {
  IAgreeGroupApplyApi,
  ICreateGroupApi,
  ICreateGroupRequestsApi,
  IDeleteGroupApplyApi,
  IDismissGroupApi,
  IEditGroupAdsApi,
  IEditGroupApi,
  IGetGroupAdsApi,
  IGetGroupMembersApi,
  IGetGroupRequestsApi,
  IGetInviteFriendsApi,
  IGroupAssignAdminApi,
  IGroupDetailApi,
  IGroupHandoverApi,
  IGroupNoSpeakApi,
  IInviteGroupApi,
  IMuteGroupApi,
  IOvertGroupApi,
  IRemoveMembersGroupApi,
  ILeaveGroupApi
} from '@/api/types/group-chat'

export const getGroupListApi = () => get('/v1/group-chats')

export const groupDetailApi = (data: IGroupDetailApi) => get('/v1/group-chats/get', data)

export const createGroupApi = (data: ICreateGroupApi) => post('/v1/group-chats/create', data)

export const editGroupApi = (data: IEditGroupApi) => post('/v1/group-chats/setting', data)

export const inviteGroupApi = (data: IInviteGroupApi) => post('/v1/group-chats/invite', data)

export const leaveGroupApi = (data: ILeaveGroupApi) => post('/v1/group-chats/leave', data)

export const getGroupMembersApi = (data: IGetGroupMembersApi): any => get('/v1/group-chats/members', data)

export const removeMembersGroupApi = (data: IRemoveMembersGroupApi) => post('/v1/group-chats/members/remove', data)

export const getInviteFriendsApi = (data: IGetInviteFriendsApi) => get('/v1/group-chats/members/invites', data)

export const groupAssignAdminApi = (data: IGroupAssignAdminApi) => post('/v1/group-chats/assign-admin', data)

export const dismissGroupApi = (data: IDismissGroupApi) => post('/v1/group-chats/dismiss', data)

export const groupHandoverApi = (data: IGroupHandoverApi) => post('/v1/group-chats/handover', data)

export const groupNoSpeakApi = (data: IGroupNoSpeakApi) => post('/v1/group-chats/no-speak', data)

export const muteGroupApi = (data: IMuteGroupApi) => post('/v1/group-chats/mute', data)

export const overtGroupApi = (data: IOvertGroupApi) => post('/v1/group-chats/overt', data)

export const createGroupRequestsApi = (data: ICreateGroupRequestsApi) => post('/v1/group-chats/requests/create', data)

export const getGroupRequestsApi = (data: IGetGroupRequestsApi) => get('/v1/group-chats/requests', data)

export const deleteGroupApplyApi = (data: IDeleteGroupApplyApi) => post('/v1/group-chats/requests/decline', data)

export const agreeGroupApplyApi = (data: IAgreeGroupApplyApi) => post('/v1/group-chats/requests/agree', data)

export const getGroupAdsApi = (data: IGetGroupAdsApi) => get('/v1/group-chats/ads', data)

export const editGroupAdsApi = (data: IEditGroupAdsApi) => post('/v1/group-chats/ads/edit', data)

export const groupApplyUnreadApi = () => get('/v1/group-chats/requests/unread')
