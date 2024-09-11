import { parseJSON } from '@/utils';
import { getEnvSpecific } from '.'

export const getStorage = getEnvSpecific<(key: string) => Promise<any>>({
  async chrome(key: string) {
    return (await chrome.storage.local.get(key))?.[key]
  },

  async net(key: string) {
    return await parseJSON(localStorage.getItem(key))
  }
})

export const setStorage = getEnvSpecific<(key: string, value: any) => Promise<void>>({
  async chrome(key: string, value: any) {
    return await chrome.storage.local.set({ [key]: value })
  },

  async net(key: string, value: any) {
    return await localStorage.setItem(key, JSON.stringify(value))
  }
})