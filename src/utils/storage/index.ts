import { CookieStorage } from '@/utils/storage/cookie-storage'
import { LocalStorage } from '@/utils/storage/local-storage'
import { SessionStorage } from '@/utils/storage/session-storage'
import { IndexedDBStorage } from '@/utils/storage/indexeddb-storage'

const CStorage = new CookieStorage()
const LStorage = new LocalStorage()
const SStorage = new SessionStorage()
const IDBStorage = new IndexedDBStorage()

export { CStorage, LStorage, SStorage, IDBStorage }
