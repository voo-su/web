import axios from 'axios'
import { ElMessage } from 'element-plus'
import { i18n } from '@/utils/i18n'
import { cookie } from '@/utils/storage/cookie-storage'
import { ACCESS_TOKEN } from '@/constants/storage'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000
})

const errorHandler = (error: any) => {
  if (error.response) {
    if (error.response.status == 401) {
      cookie.remove(ACCESS_TOKEN)
      ElMessage.error(i18n('sessionExpired'))
      location.reload()
    }
  }

  return Promise.reject(error)
}

request.interceptors.request.use(config => {
  const token = cookie.get(ACCESS_TOKEN)
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
