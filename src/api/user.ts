import { get } from '@/utils/request'

interface IUserSearchApi {
  username: string
}

export const userSearchApi = (data: IUserSearchApi) => get('/v1/users/search', data)
