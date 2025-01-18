import { get, post } from '@/utils/request'
import type { ICreateBot } from '@/api/types/bot'

export const getBots = () => get('/v1/bots')

export const createBot = (data: ICreateBot) => post('/v1/bots', data)
