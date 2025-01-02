// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { get, post } from '@/utils/request'

export const getBots = () => get('/v1/bots')

export const createBot = (data: any) => post('/v1/bots', data)
