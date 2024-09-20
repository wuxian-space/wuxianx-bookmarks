import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { isPlainObject, debounce } from 'lodash-es'
import { getContent, getUserinfo, upsertUserSettings } from '@/api/github'
import { BACKGROUND_CONNECT_NAME, CONNECT_CODES, STORAGE_KEY, SYNC_DELAY, USER_SETTINGS_FILENAME } from '@/constants'
import { getStorage, setStorage } from '@/utils/storage'
import { parseGithubUrl } from '@/utils/common'

type Ignores = string[]

export interface Settings {
  url?: string
  ignores?: string[]
  autoSync?: boolean
  githubToken?: string
  githubAuthorName?: string
  githubAuthorEmail?: string
}

export type LocalSettings = Pick<Settings, 'githubToken' | 'url'>
export type RemoteSettings = Omit<Settings, keyof LocalSettings>

type SettingsKeys = keyof Settings


export default defineStore('settings', () => {
  let runtimeConnect: chrome.runtime.Port
  try {
    runtimeConnect = chrome.runtime.connect(undefined, {
      name: BACKGROUND_CONNECT_NAME
    });
  } catch (error) {
    console.error(`🚀 > chrome.runtime.connect -> error:`, error);
  }

  const userSettings = ref<Settings>({
    ignores: []
  })

  const githubAuthorEmail = computed(() => userSettings.value.githubAuthorEmail)
  const githubAuthorName = computed(() => userSettings.value.githubAuthorName)
  const githubToken = computed(() => userSettings.value.githubToken)

  const parsedRepoUrl = computed(() => parseGithubUrl(userSettings.value.url!))
  const repo = computed(() => parsedRepoUrl.value?.repo)
  const owner = computed(() => parsedRepoUrl.value?.owner)

  const githubError = ref('')

  const ignores = ref<Ignores>([])

  initFormData()
  function initFormData() {
    getSettings()
  }

  const updateSettings = debounce(async (key: SettingsKeys) => {
    if (key === 'ignores') {
      userSettings.value.ignores = ignores.value || []
    }

    const storageKeys: SettingsKeys[] = ['githubToken', 'url']

    if (storageKeys.includes(key)) {
      const localSettings: Settings = {}

      storageKeys.forEach(key => {
        localSettings[key] = userSettings.value[key] as any
      })

      await setStorage(STORAGE_KEY, localSettings)

      if (key === 'githubToken' || key === 'url') {
        await getRemoteSettings()
      }

      return;
    }

    const { githubToken, url, ...rest } = userSettings.value
    await upsertUserSettings(rest)

    if (key === 'autoSync') {
      runtimeConnect?.postMessage({ code: userSettings.value.autoSync ? CONNECT_CODES.OPEN_AUTO_SYNC : CONNECT_CODES.CLOSE_AUTO_SYNC });
    }
  }, SYNC_DELAY)

  async function getSettings() {
    userSettings.value = await _getSettings()
    ignores.value = userSettings.value.ignores || []
  }


  return {
    userSettings,
    githubToken,
    githubAuthorName,
    githubAuthorEmail,
    ignores,
    repo,
    owner,
    githubError,
    updateSettings,
  }
})

export async function _getSettings() {
  let settings: Settings = { ignores: [] }

  const localSettings: LocalSettings = await getLocalSettings()

  settings = {
    ...localSettings || {}
  }

  if (!localSettings?.githubToken || !localSettings?.url) return settings

  const remoteSettings = await getRemoteSettings()
  settings = {
    ...localSettings,
    ...remoteSettings,
  }

  settings.ignores = remoteSettings.ignores || []

  return settings
}

export async function getLocalSettings() {
  return ((await getStorage(STORAGE_KEY)) || {}) as LocalSettings
}

export async function getRemoteSettings() {
  let settings: Settings = {}

  try {
    const remoteSettings = await getContent(USER_SETTINGS_FILENAME)

    // @ts-ignore
    if (isPlainObject(remoteSettings?.content)) {
      settings = {
        ...settings,
        ...remoteSettings.content as any
      }
    }
  } catch (error) {
    console.log(`🚀 > getRemoteSettings > error:`, error);
  }

  if (!settings.githubAuthorEmail || !settings.githubAuthorName) {
    const githubUserinfo = await getUserinfo()

    if (!settings.githubAuthorName) {
      settings.githubAuthorName = githubUserinfo.name as any
    }

    if (!settings.githubAuthorEmail) {
      settings.githubAuthorEmail = githubUserinfo.email as any
    }
  }

  return settings
}