import { logE } from '@/utils/log'

export class LocalStorage {
  addItem<T>(key: string, value: T, expire: number | null = 60 * 60 * 24): void {
    const item = {
      value,
      expire: expire !== null ? Date.now() + expire * 1000 : null
    }
    localStorage.setItem(key, JSON.stringify(item))
  }

  getItem<T>(key: string, def: T = null as T): T {
    const item = localStorage.getItem(key)
    if (!item) return def

    try {
      const { value, expire }: { value: T; expire: number | null } = JSON.parse(item)

      if (expire === null || expire >= Date.now()) {
        return value
      } else {
        this.deleteItem(key)
      }
    } catch (e) {
      logE(`Ошибка при парсинге данных из localStorage: ${e}`)
    }

    return def
  }

  deleteItem(key: string): void {
    localStorage.removeItem(key)
  }

  clear(): void {
    localStorage.clear()
  }
}
