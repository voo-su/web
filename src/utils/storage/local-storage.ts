// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

class LocalStorage {

  get(key: string, def: any = '') {
    const item = localStorage.getItem(key)
    if (!item) return def
    try {
      const {
        value,
        expire
      } = JSON.parse(item)
      if (expire === null || expire >= Date.now()) {
        return value
      }
      this.remove(key)
    } catch (e) {
    }
    return def
  }

  set(key: string, value: string, expire: number | null = 60 * 60 * 24) {
    localStorage.setItem(key, JSON.stringify({
        value,
        expire: expire !== null
          ? new Date().getTime() + expire * 1000
          : null
      })
    )
  }

  remove(key: string) {
    localStorage.removeItem(key)
  }

  clear() {
    localStorage.clear()
  }
}

export const storage = new LocalStorage()
