import { get, post } from '@/utils/request'

export const getBots = (data: any) => get('/v1/bots')

export const createBot = (data: any) => post('/v1/bots', data)
