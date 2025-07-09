import Dexie, { type EntityTable } from 'dexie'

interface ApiKey {
  id: number
  key: string
}

// 建立資料庫實例
const db = new Dexie('ApiKeyDatabase') as Dexie & {
  apiKeys: EntityTable<ApiKey, 'id'>
}

// 定義資料庫結構
db.version(1).stores({
  apiKeys: '++id, key',
})

export type { ApiKey }
export { db }
