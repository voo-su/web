import { post, upload } from '@/utils/request'

export const uploadAvatarApi = (data: any) => post('/v1/upload/avatar', data)

export const uploadImageApi = (data: any) => post('/v1/upload/image', data)

export const findFileSplitInfoApi = (data = {}) => post('/v1/upload/multipart/initiate', data)

export const fileSubareaUploadApi = (data = {}, options = {}) => upload('/v1/upload/multipart', data, options)
