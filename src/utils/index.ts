export const isChromeExtEnv = !!chrome?.runtime?.id

export function getEnvSpecific(specific: { chrome: any; net: any }) {
  if (isChromeExtEnv) return specific.chrome

  return specific.net
}