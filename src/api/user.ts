import { get } from '@/utils/request'

export const userSearchApi = data => get('/v1/user/search', data)
