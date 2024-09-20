import runBookmarksScript from './bookmarks'

runBookmarksScript()

chrome.action.onClicked.addListener(() => {
  const home = chrome.runtime.getURL('index.html');
  chrome.tabs.create({ url: home })
});