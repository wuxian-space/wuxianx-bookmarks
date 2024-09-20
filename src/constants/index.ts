export const STORAGE_KEY = 'storageSettings'
export const USER_SETTINGS_FILENAME = 'user-config.json'
export const BOOKMARKS_DATA_FILENAME = 'bookmarks-data.json'
export const NAMESPACE = 'b'

export const BACKGROUND_CONNECT_NAME = 'SERVICE_WORKER'

// 同步延时时间，如果 2 次同步间隔小于该值，则忽略 (debounce)
export const SYNC_DELAY = 10 * 1000

export enum CONNECT_CODES {
  CLOSE_AUTO_SYNC = 1001,
  OPEN_AUTO_SYNC
}