import { get } from '@/utils/request'

interface IUserSearchApi {
    surname: string
}

export const userSearchApi = (data: IUserSearchApi) => get('/v1/users/search', data)
