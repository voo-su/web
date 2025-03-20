import { logE } from '@/utils/log'

export class SessionStorage {
  addItem<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value))
  }

  getItem<T>(keys: string | string[]): { [key: string]: T } | T | null {
    if (Array.isArray(keys)) {
      const data: { [key: string]: T } = {}
      keys.forEach(key => {
        const item = sessionStorage.getItem(key)
        if (item !== null) {
          try {
            data[key] = JSON.parse(item) as T
          } catch (e) {
            logE(`Ошибка при парсинге данных для ключа: ${key} - ${e}`)
          }
        }
      })
      return data
    } else {
      const item = sessionStorage.getItem(keys)
      if (item !== null) {
        try {
          return JSON.parse(item) as T
        } catch (e) {
          logE(`Ошибка при парсинге данных для ключа: ${keys} - ${e}`)
        }
      }
      return null
    }
  }

  deleteItem(keys: string | string[]): void {
    if (Array.isArray(keys)) {
      keys.forEach(key => sessionStorage.removeItem(key))
    } else {
      sessionStorage.removeItem(keys)
    }
  }

  clear(): void {
    sessionStorage.clear()
  }
}
