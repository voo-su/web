// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { post } from '@/utils/request'
import type { ILoginApi, IVerifyApi } from '@/api/types/auth'

export const loginApi = (data: ILoginApi) => post('/v1/auth/login', data)

export const verifyApi = (data: IVerifyApi) => post('/v1/auth/verify', data)

export const logoutApi = () => post('/v1/auth/logout')
