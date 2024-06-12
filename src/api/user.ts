import { get } from '@/utils/request'

export const userSearchApi = data => get('/v1/users/search', data)
