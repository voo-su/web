class CookieStorage {

  set(name: string, value: string, expiresInSeconds: number = 0): void {
    const encodedName = encodeURIComponent(name)
    const encodedValue = encodeURIComponent(value)
    const date = new Date(Date.now() + expiresInSeconds * 1000)
    const expires = date.toUTCString()
    let cookieValue = `${encodedName}=${encodedValue}; expires=${expires}; path=/`
    // if (import.meta.env.VITE_APP_ENV != 'dev') {
    //   cookieValue += '; HttpOnly'
    // }
    document.cookie = cookieValue
  }

  get(key: string): string | null {
    const name = `${key}=`
    const cookieString = decodeURIComponent(document.cookie)
    const cookies = cookieString.split(';')
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1)
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length)
      }
    }
    return null
  }

  remove(names: string | any[]): void {
    if (Array.isArray(names)) {
      const len = names.length
      for (let i = 0; i < len; i++) {
        const name = names[i]
        if (name)
          this.set(name, '', -1)
      }
    } else {
      this.set(names, '', -1)
    }
  }

}

export const cookie = new CookieStorage()
