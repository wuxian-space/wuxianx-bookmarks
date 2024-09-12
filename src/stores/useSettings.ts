
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { isPlainObject } from 'lodash-es'
import { getContent, getUserinfo, upsertUserSettings } from '@/api/github'
import { STORAGE_KEY, USER_SETTINGS_FILENAME } from '@/constants'
import { getStorage, setStorage } from '@/utils/storage'
import { parseGithubUrl } from '@/utils/common'

type Ignores = string[]

interface Settings {
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

  async function updateSettings(key: SettingsKeys) {
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
  }

  async function getSettings() {
    const localSettings: LocalSettings = await getStorage(STORAGE_KEY)

    userSettings.value = {
      ...userSettings.value,
      ...localSettings || {}
    }

    if (!localSettings?.githubToken || !localSettings?.url) return

    const remoteSettings = await getRemoteSettings()
    userSettings.value = {
      ...localSettings,
      ...remoteSettings,
    }

    ignores.value = remoteSettings.ignores || []
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
    ignores,
    repo,
    owner,
    githubError,
    updateSettings,
  }
})