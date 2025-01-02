// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

class SessionStorage {

  set(key: string, value: any): void {
    sessionStorage.setItem(`${key}`, JSON.stringify(value))
  }

  get(keys: string | any[]): any {
    let data: { [index: string]: any } | null = {}
    if (Array.isArray(keys)) {
      for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i]
        data[key] = JSON.parse(sessionStorage.getItem(key) as string) as any
      }
    } else {
      data = null
      if (keys)
        data = JSON.parse(sessionStorage.getItem(keys) as string) as any
    }
    return data
  }

  remove(keys: string | string[]) {
    if (Array.isArray(keys)) {
      for (let i = 0, len = keys.length; i < len; i++) {
        sessionStorage.removeItem(keys[i])
      }
    } else {
      sessionStorage.removeItem(keys)
    }
  }

}

export const session = new SessionStorage()
