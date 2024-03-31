import { get, post } from '@/utils/request'

export const groupDetailApi = data => get('/v1/group-chat/detail', data)

export const createGroupApi = data => post('/v1/group-chat/create', data)

export const editGroupApi = data => post('/v1/group-chat/setting', data)

export const inviteGroupApi = data => post('/v1/group-chat/invite', data)

export const removeMembersGroupApi = data => post('/v1/group-chat/member/remove', data)

export const secedeGroupApi = data => post('/v1/group-chat/leave-chat', data)

export const getInviteFriendsApi = data => get('/v1/group-chat/member/invites', data)

export const getGroupMembersApi = data => get('/v1/group-chat/members', data)

export const groupAssignAdminApi = data => post('/v1/group-chat/assign-admin', data)
