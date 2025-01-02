// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import axios from 'axios'
import { delAccessToken, getAccessToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { i18n } from '@/utils/i18n'

const t = i18n()

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000
})

const errorHandler = (error: any) => {
  if (error.response) {
    if (error.response.status == 401) {
      delAccessToken()
      ElMessage.error(t('sessionExpired'))
      location.reload()
    }
  }

  return Promise.reject(error)
}

request.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
}, errorHandler)

request.interceptors.response.use(response => response.data, errorHandler)

export const get = (url: string, data = {}, options = {}) => {
  return request({
    url,
    params: data,
    method: 'get',
    ...options
  })
}

export const post = (url: string, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data: data,
    ...options
  })
}

export const put = (url: string, data = {}, options = {}) => {
  return request({
    url,
    method: 'put',
    data: data,
    ...options
  })
}

export const upload = (url: string, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data: data,
    ...options
  })
}
