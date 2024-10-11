import browser from 'webextension-polyfill'

export async function getTree() {
  const tree = await browser.bookmarks.getTree()
  return tree?.[0]?.children || []
}