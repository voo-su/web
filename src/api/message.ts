import { get, post, upload } from '@/utils/request'

export const dialogRecordsApi = (data = {}) => get('/v1/messages', data)

export const publishMessageApi = (data = {}) => post('/v1/messages/publish', data)

export const sendDialogFileApi = (data = {}) => post('/v1/messages/file', data)

export const sendDialogImageApi = (data = {}) => upload('/v1/messages/image', data)

export const revokeRecordsApi = (data = {}) => post('/v1/messages/revoke', data)

export const removeRecordsApi = (data = {}) => post('/v1/messages/delete', data)

export const sendVoteApi = (data = {}) => post('/v1/messages/vote', data)

export const confirmVoteHandleApi = (data = {}) => post('/v1/messages/vote/handle', data)

export const getStickerListApi = () => get('/v1/messages/stickers')

export const sendStickerApi = (data = {}) => post('/v1/messages/stickers', data)

export const uploadStickerApi = (data = {}) => upload('/v1/messages/stickers/create', data)

export const deleteStickerApi = (data = {}) => upload('/v1/messages/stickers/delete', data)

export const collectStickerApi = (data = {}) => post('/v1/messages/collect', data)

export const forwardRecordsApi = (data = {}) => post('/v1/messages/forward', data)
