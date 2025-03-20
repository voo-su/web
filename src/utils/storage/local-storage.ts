import { logE } from '@/utils/log'

class LocalStorage {

  get<T>(key: string, def: T = null as T): T {
    const item = localStorage.getItem(key)
    if (!item) return def

    try {
      const { value, expire }: { value: T; expire: number | null } = JSON.parse(item)

      if (expire === null || expire >= Date.now()) {
        return value
      } else {
        this.remove(key)
      }
    } catch (e) {
      logE(`Ошибка при парсинге данных из localStorage: ${e}`)
    }

    return def
  }

  set<T>(key: string, value: T, expire: number | null = 60 * 60 * 24): void {
    const item = {
      value,
      expire: expire !== null ? Date.now() + expire * 1000 : null
    }
    localStorage.setItem(key, JSON.stringify(item))
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }

  clear(): void {
    localStorage.clear()
  }
}

export const storage = new LocalStorage()
