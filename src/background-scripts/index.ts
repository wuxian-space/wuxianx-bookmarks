import browser from 'webextension-polyfill'

import runBookmarksScript from './bookmarks'

runBookmarksScript()

browser.action.onClicked.addListener(() => {
  const home = browser.runtime.getURL('index.html');
  browser.tabs.create({ url: home })
});