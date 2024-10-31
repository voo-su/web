import { get, post } from '@/utils/request'

export const getBots = () => get('/v1/bots')

export const createBot = (data: any) => post('/v1/bots', data)
