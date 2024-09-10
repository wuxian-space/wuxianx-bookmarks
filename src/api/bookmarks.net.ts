export const getTree = async () => {
  return await fetch(`./bookmarks-data.json?${Date.now()}`)
    .then(response => response.json())
}