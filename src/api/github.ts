import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { encode, decode } from 'js-base64';
import _path from 'path-browserify'
import { isPlainObject } from 'lodash-es'

import { _getSettings, getLocalSettings, RemoteSettings } from '@/stores/useSettings'
import { BOOKMARKS_DATA_FILENAME, USER_SETTINGS_FILENAME } from '@/constants';
import { parseGithubUrl, parseJSON } from '@/utils';

async function createOctokit() {
  const settings = await getLocalSettings()
  const parsedRepoUrl = parseGithubUrl(settings.url!)

  const octokit = new Octokit({
    auth: settings.githubToken
  });


  octokit.hook.before('request', (options) => {
    if (!settings.url) {
      throw new Error('No url')
    }

    if (!settings.githubToken) {
      throw new Error('Not authenticated')
    }

    options.owner = parsedRepoUrl.owner
    options.repo = parsedRepoUrl.repo
  })

  // octokit.hook.after('request', () => {
  //   settings.githubError = ''
  // })

  // octokit.hook.error('request', (error) => {
  //   settings.githubError = error.message
  // })

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
  const settings = await _getSettings()

  const data: RestEndpointMethodTypes["repos"]["createOrUpdateFileContents"]["parameters"] = {
    path,
    owner: '',
    repo: '',
    message: `updated ${path}`,
    content: encode(content),
    author: {
      name: settings.githubAuthorName!,
      email: settings.githubAuthorEmail!
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