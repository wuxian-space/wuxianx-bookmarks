export async function getTree() {
  const tree = await chrome.bookmarks.getTree()
  return tree?.[0]?.children || []
}