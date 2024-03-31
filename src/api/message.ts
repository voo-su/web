import { get, post, upload } from '@/utils/request'

export const dialogRecordsApi = (data = {}) => get('/v1/message/list', data)

export const publishMessageApi = (data = {}) => post('/v1/message/publish', data)

export const sendDialogFileApi = (data = {}) => post('/v1/message/file', data)

export const sendDialogImageApi = (data = {}) => upload('/v1/message/image', data)

export const revokeRecordsApi = (data = {}) => post('/v1/message/revoke', data)

export const removeRecordsApi = (data = {}) => post('/v1/message/delete', data)

export const sendVoteApi = (data = {}) => post('/v1/message/vote', data)

export const confirmVoteHandleApi = (data = {}) => post('/v1/message/vote/handle', data)
