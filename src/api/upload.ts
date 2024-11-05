import { post, upload } from '@/utils/request'
import type { IFindFileSplitInfoApi } from '@/api/types/upload'

export const uploadApi = (data: FormData) => post('/v1/upload', data)

export const findFileSplitInfoApi = (data: IFindFileSplitInfoApi) => post('/v1/upload/multipart/initiate', data)

export const fileSubareaUploadApi = (data: FormData, options = {}) => upload('/v1/upload/multipart', data, options)

export const uploadAvatarApi = (data: FormData) => post('/v1/upload/avatar', data)
