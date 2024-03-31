import axios from 'axios'
import { delAccessToken, getAccessToken } from '@/utils/auth'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000
})

const errorHandler = error => {
  if (error.response) {
    if (error.response.status == 401) {
      delAccessToken()
      window['$message'].error('Ваша текущая сессия истекла. Пожалуйста, выполните вход заново.')
      // window['$dialog'].info({
      //     title: 'Важное сообщение',
      //     content: 'Ваша текущая сессия истекла. Пожалуйста, выполните вход заново.',
      //     positiveText: 'Войти сейчас?',
      //     maskClosable: false,
      //     onPositiveClick: () => {
      location.reload()
      //     }
      //   })
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

export const get = (url, data = {}, options = {}) => {
  return request({
    url,
    params: data,
    method: 'get',
    ...options
  })
}

export const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data: data,
    ...options
  })
}

export const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'put',
    data: data,
    ...options
  })
}

export const upload = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data: data,
    ...options
  })
}
