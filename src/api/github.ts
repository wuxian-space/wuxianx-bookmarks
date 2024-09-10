import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { encode } from 'js-base64';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_AUTH
});

export async function createOrUpdateFileContents(content: string) {
  const owner = 'yuexiaoliang';
  const repo = 'browser-bookmarks-site';
  const path = 'bookmarks-data.json';

  const authorName = 'yuexiaoliang'
  const authorEmail = '2220124666@qq.com';

  const data: RestEndpointMethodTypes["repos"]["createOrUpdateFileContents"]["parameters"] = {
    owner,
    repo,
    path,
    message: `updated ${path}`,
    content: encode(content),
    author: { name: authorName, email: authorEmail },
  }

  const { data: repoFiles } = await octokit.rest.repos
    .getContent({ owner, repo, path: '' })

  if (Array.isArray(repoFiles)) {
    const f = repoFiles.find(item => item.path === path)
    if (f) data.sha = f.sha
  }

  await octokit.rest.repos.createOrUpdateFileContents(data);
}