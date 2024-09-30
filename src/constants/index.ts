export const STORAGE_KEY = 'storageSettings'
export const USER_SETTINGS_FILENAME = 'user-settings.json'
export const BOOKMARKS_DATA_FILENAME = 'bookmarks-data.json'
export const NAMESPACE = 'b'

export const SERVICE_NAME = 'WUXIAN_BOOKMARKS_SERVICE'
export const CLIENT_NAME = 'WUXIAN_BOOKMARKS_CLIENT'

// 同步延时时间，如果 2 次同步间隔小于该值，则忽略 (debounce)
export const SYNC_DELAY = 1 * 1000

export enum CONNECT_CODES {
  CLOSE_AUTO_SYNC = 1001,
  OPEN_AUTO_SYNC,
  START_SYNC,
  BOOKMARKS_CHANGED
}