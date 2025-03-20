export class CookieStorage {
  addItem(
    name: string,
    value: string | object,
    expiresInSeconds: number = 0,
    path: string = '/',
    secure: boolean = false
  ): void {
    const encodedName = encodeURIComponent(name)
    const encodedValue = encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : value)
    const date = new Date(Date.now() + expiresInSeconds * 1000)
    const expires = expiresInSeconds ? `expires=${date.toUTCString()};` : ''
    let cookieValue = `${encodedName}=${encodedValue}; ${expires} path=${path};`

    if (secure) cookieValue += ' Secure;'

    document.cookie = cookieValue
  }

  getItem<T = string | object>(key: string): T | null {
    const name = `${encodeURIComponent(key)}=`
    const cookies = document.cookie ? document.cookie.split('; ') : []

    for (let cookie of cookies) {
      let [cookieName, cookieValue] = cookie.split('=')
      if (cookieName === name.slice(0, -1)) {
        try {
          return JSON.parse(decodeURIComponent(cookieValue)) as T
        } catch {
          return decodeURIComponent(cookieValue) as T
        }
      }
    }
    return null
  }

  deleteItem(names: string | string[], path: string = '/', secure: boolean = false): void {
    if (Array.isArray(names)) {
      for (let name of names) {
        this.addItem(name, '', -1, path, secure)
      }
    } else {
      this.addItem(names, '', -1, path, secure)
    }
  }

  exists(key: string): boolean {
    return this.getItem(key) !== null
  }
}
