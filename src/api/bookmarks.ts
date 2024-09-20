export async function getTree() {
  // const tree = (await import('./_mock')).default
  const tree = await chrome.bookmarks.getTree()
  return tree?.[0]?.children || []
}