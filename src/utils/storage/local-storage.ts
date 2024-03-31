class LocalStorage {

  get(key, def: any = '') {
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

  set(key, value, expire = 60 * 60 * 24) {
    localStorage.setItem(key, JSON.stringify({
        value,
        expire: expire !== null
          ? new Date().getTime() + expire * 1000
          : null
      })
    )
  }

  remove(key) {
    localStorage.removeItem(key)
  }

  clear() {
    localStorage.clear()
  }
}

export const storage = new LocalStorage()
