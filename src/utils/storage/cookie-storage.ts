class CookieStorage {

  set(
    name: string,
    value: string,
    expiresInSeconds: number = 0,
    path: string = '/',
    secure: boolean = false,
    httpOnly: boolean = false
  ): void {
    const encodedName = encodeURIComponent(name)
    const encodedValue = encodeURIComponent(value)
    const date = new Date(Date.now() + expiresInSeconds * 1000)
    const expires = expiresInSeconds ? `expires=${date.toUTCString()};` : ''
    let cookieValue = `${encodedName}=${encodedValue}; ${expires} path=${path};`

    if (secure) cookieValue += ' Secure;'
    if (httpOnly) cookieValue += ' HttpOnly;'

    document.cookie = cookieValue
  }

  get(key: string): string | null {
    const name = `${encodeURIComponent(key)}=`
    const cookies = document.cookie ? document.cookie.split('; ') : []

    for (let cookie of cookies) {
      if (cookie.startsWith(name)) {
        return cookie.substring(name.length)
      }
    }
    return null
  }

  remove(names: string | string[], path: string = '/', secure: boolean = false, httpOnly: boolean = false): void {
    if (Array.isArray(names)) {
      for (let name of names) {
        this.set(name, '', -1, path, secure, httpOnly)
      }
    } else {
      this.set(names, '', -1, path, secure, httpOnly)
    }
  }

  exists(key: string): boolean {
    return this.get(key) !== null
  }
}

export const cookie = new CookieStorage()
