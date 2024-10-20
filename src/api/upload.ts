import { post, upload } from '@/utils/request'
import type { IFindFileSplitInfoApi } from '@/api/types/upload'

export const uploadAvatarApi = (data: FormData) => post('/v1/upload/avatar', data)

export const uploadImageApi = (data: FormData) => post('/v1/upload/image', data)

export const findFileSplitInfoApi = (data: IFindFileSplitInfoApi) => post('/v1/upload/multipart/initiate', data)

export const fileSubareaUploadApi = (data: FormData, options = {}) => upload('/v1/upload/multipart', data, options)
