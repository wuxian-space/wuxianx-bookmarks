export const isChromeExtEnv = !!chrome?.runtime?.id

export function getEnvSpecific(specific: { chrome: any; net: any }) {
  if (isChromeExtEnv) return specific.chrome

  return specific.net
}

export function parseGithubUrl(url: string) {
  const regex = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)(?:\.git)?$/
  const match = url.match(regex);

  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }

  return {
    owner: match[1],
    repo: match[2]
  };
}

export function parseJSON(content: string) {
  let result = content

  try {
    result = JSON.parse(result)
  } catch (error) { }

  return result
}