
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { isPlainObject } from 'lodash-es'
import { getContent, getUserinfo, upsertUserSettings } from '@/api/github'
import { STORAGE_KEY, USER_SETTINGS_FILENAME } from '@/constants'
import { parseGithubUrl } from '@/utils'

interface Settings {
  url?: string
  ignores?: string
  autoSync?: boolean
  githubToken?: string
  githubAuthorName?: string
  githubAuthorEmail?: string
}

export type LocalSettings = Pick<Settings, 'githubToken' | 'url'>
export type RemoteSettings = Omit<Settings, keyof LocalSettings>

type SettingsKeys = keyof Settings

export default defineStore('settings', () => {
  const userSettings = ref<Settings>({})

  const githubAuthorEmail = computed(() => userSettings.value.githubAuthorEmail)
  const githubAuthorName = computed(() => userSettings.value.githubAuthorName)
  const githubToken = computed(() => userSettings.value.githubToken)

  const parsedRepoUrl = computed(() => parseGithubUrl(userSettings.value.url!))
  const repo = computed(() => parsedRepoUrl.value?.repo)
  const owner = computed(() => parsedRepoUrl.value?.owner)

  const githubError = ref('')


  initFormData()
  function initFormData() {
    getSettings()
  }

  async function updateSettings(key: SettingsKeys) {
    const storageKeys: SettingsKeys[] = ['githubToken', 'url']

    if (storageKeys.includes(key)) {
      const localSettings: Settings = {}

      storageKeys.forEach(key => {
        localSettings[key] = userSettings.value[key] as any
      })

      await chrome.storage.local.set({
        [STORAGE_KEY]: localSettings
      })

      if (key === 'githubToken' || key === 'url') {
        await getRemoteSettings()
      }

      return;
    }

    const { githubToken, url, ...rest } = userSettings.value
    await upsertUserSettings(rest)
  }

  async function getSettings() {
    const { [STORAGE_KEY]: localSettings } = await chrome.storage.local.get(STORAGE_KEY)

    userSettings.value = localSettings || {}
    if (!localSettings?.githubToken || !localSettings?.url) return

    const remoteSettings = await getRemoteSettings()
    userSettings.value = {
      ...localSettings,
      ...remoteSettings,
    }
  }

  async function getRemoteSettings() {
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
    } catch (error) { }

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

  return {
    userSettings,
    githubToken,
    githubAuthorName,
    githubAuthorEmail,
    repo,
    owner,
    githubError,
    updateSettings,
  }
})