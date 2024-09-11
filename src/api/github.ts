import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { encode, decode } from 'js-base64';
import _path from 'path-browserify'
import { isPlainObject } from 'lodash-es'

import useSettings, { RemoteSettings } from '@/stores/useSettings'
import { BOOKMARKS_DATA_FILENAME, USER_SETTINGS_FILENAME } from '@/constants';
import { parseJSON } from '@/utils';

function createOctokit() {
  const settingsStore = useSettings()

  const octokit = new Octokit({
    auth: settingsStore.githubToken
  });

  octokit.hook.before('request', (options) => {
    if (!settingsStore.userSettings.url) {
      throw new Error('No url')
    }

    if (!settingsStore.githubToken) {
      throw new Error('Not authenticated')
    }

    options.owner = settingsStore.owner
    options.repo = settingsStore.repo
  })

  octokit.hook.after('request', () => {
    settingsStore.githubError = ''
  })

  octokit.hook.error('request', (error) => {
    settingsStore.githubError = error.message
  })

  return octokit
}

export async function getUserinfo() {
  const octokit = await createOctokit()

  const { data: user } = await octokit.rest.users.getAuthenticated()

  return user
}

export async function getContent(path: string) {
  const octokit = await createOctokit()

  const res = await octokit.rest.repos
    .getContent({ path, owner: '', repo: '' })

  const data: RestEndpointMethodTypes["repos"]["getContent"]["response"]['data'] & { content?: string | Record<string, any> } = res.data

  if (Array.isArray(data)) return data;

  if (typeof data.content === 'string') data.content = parseContent(data.content)

  return data

  function parseContent(content: string) {
    return parseJSON(decode(content))
  }
}

export async function upsertContents(path: string, content: string) {
  const octokit = await createOctokit()

  const settingsStore = useSettings()

  const data: RestEndpointMethodTypes["repos"]["createOrUpdateFileContents"]["parameters"] = {
    path,
    owner: '',
    repo: '',
    message: `updated ${path}`,
    content: encode(content),
    author: {
      name: settingsStore.githubAuthorName!,
      email: settingsStore.githubAuthorEmail!
    },
  }

  try {
    const f = await getContent(path) as any
    if (isPlainObject(f)) data.sha = f.sha
  } catch (error) { }

  return await octokit.rest.repos.createOrUpdateFileContents(data);
}

export async function upsertUserSettings(content: RemoteSettings) {
  return await upsertContents(USER_SETTINGS_FILENAME, JSON.stringify(content))
}

export async function upsertBookmarksData(content: string) {
  return await upsertContents(BOOKMARKS_DATA_FILENAME, content);
}