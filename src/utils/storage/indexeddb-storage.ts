import { INDEXEDDB } from '@/constants/storage'
import { logE } from '@/utils/log'

export class IndexedDBStorage {
  private db: IDBDatabase | null = null
  private isDbInitialized = false

  constructor(private storeName: string = 'photos') {
    this.initDB()
  }

  private initDB(): void {
    const request = indexedDB.open(INDEXEDDB, 1)

    request.onerror = (event: Event) => {
      logE(`Ошибка при открытии базы данных: ${(event.target as IDBRequest).error}`)
    }

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBRequest<IDBDatabase>).result
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, {
          keyPath: 'id'
        })
      }
    }

    request.onsuccess = (event: Event) => {
      this.db = (event.target as IDBRequest<IDBDatabase>).result
      this.isDbInitialized = true
    }
  }

  checkDbInitialization(): void {
    if (!this.isDbInitialized) {
      throw new Error('База данных не инициализирована')
    }
  }

  addItem(item: {
    name: string
    type: string
    content: Blob
  }): Promise<void> {
    this.checkDbInitialization()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const addRequest = store.add({
        id: Date.now(),
        ...item
      })

      addRequest.onsuccess = () => resolve()
      addRequest.onerror = (event: Event) => reject((event.target as IDBRequest).error)
    })
  }

  getAllItems(): Promise<any[]> {
    this.checkDbInitialization()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = (event: Event) => reject(new Error(`Ошибка при загрузке элементов: ${(event.target as IDBRequest).error}`))
    })
  }

  updateItem(id: number, newData: Partial<{
    name: string
    type: string
    content: Blob
  }>): Promise<void> {
    this.checkDbInitialization()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const data = getRequest.result
        if (data) {
          Object.assign(data, newData)
          const putRequest = store.put(data)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = (event: Event) => reject((event.target as IDBRequest).error)
        } else {
          reject(new Error(`Элемент с id ${id} не найден`))
        }
      }
      getRequest.onerror = (event: Event) => reject((event.target as IDBRequest).error)
    })
  }

  deleteItem(id: number): Promise<void> {
    this.checkDbInitialization()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const deleteRequest = store.delete(id)

      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = (event: Event) => reject((event.target as IDBRequest).error)
    })
  }
}
