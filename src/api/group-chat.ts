import { get, post } from '@/utils/request'

export const getGroupListApi = () => get('/v1/group-chats')

export const groupDetailApi = (data: any) => get('/v1/group-chats/get', data)

export const createGroupApi = (data: any) => post('/v1/group-chats/create', data)

export const editGroupApi = (data: any) => post('/v1/group-chats/setting', data)

export const inviteGroupApi = (data: any) => post('/v1/group-chats/invite', data)

export const secedeGroupApi = (data: any) => post('/v1/group-chats/leave-chat', data)

export const getGroupMembersApi = (data: any): any => get('/v1/group-chats/members', data)

export const removeMembersGroupApi = (data: any) => post('/v1/group-chats/members/remove', data)

export const getInviteFriendsApi = (data: any) => get('/v1/group-chats/members/invites', data)

export const groupAssignAdminApi = (data: any) => post('/v1/group-chats/assign-admin', data)

export const groupOvertListApi = (data: any) => get('/v1/group-chats/overt/list', data)

export const dismissGroupApi = (data: any) => post('/v1/group-chats/dismiss', data)

export const groupHandoverApi = (data: any) => post('/v1/group-chats/handover', data)

export const groupNoSpeakApi = (data: any) => post('/v1/group-chats/no-speak', data)

export const muteGroupApi = (data: any) => post('/v1/group-chats/mute', data)

export const overtGroupApi = (data: any) => post('/v1/group-chats/overt', data)

export const createGroupRequestsApi = (data: any) => post('/v1/group-chats/requests/create', data)

export const getGroupRequestsApi = (data: any) => get('/v1/group-chats/requests', data)

export const deleteGroupApplyApi = (data: any) => post('/v1/group-chats/requests/decline', data)

export const agreeGroupApplyApi = (data: any) => post('/v1/group-chats/requests/agree', data)
