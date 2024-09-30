import { debounce } from 'lodash-es'
import wait from 'wait'
import browser from 'webextension-polyfill'
import { getTree } from '@/api/bookmarks';
import { upsertBookmarksData } from '@/api/github';
import { CONNECT_CODES, CLIENT_NAME, SYNC_DELAY, SERVICE_NAME } from '@/constants'
import { _getSettings, Settings } from '@/stores/useSettings';
import { toSyncBookmarks } from '@/common';


export default async function () {
  const bookmarks = chrome.bookmarks

  let settings: Settings

  const startSync = debounce(async () => {
    console.log('startSync')
    if (!settings?.githubToken || !settings.autoSync) return;

    chrome.action.setBadgeText({ text: '...' })

    const tree = await getTree()
    const syncTree = toSyncBookmarks(tree, settings?.ignores)
    // await upsertBookmarksData(JSON.stringify(syncTree));

    chrome.action.setBadgeText({ text: '' })

    chrome.notifications.create('sync-bookmarks-success', {
      type: 'basic',
      iconUrl: '/icons/icon.png',
      title: `Wuxian Bookmarks`,
      message: 'Bookmarks have been successfully synchronized.',
    })
  }, SYNC_DELAY)

  const change = async (type: 'created' | 'removed' | 'moved' | 'changed' | 'childrenReordered', data?: any) => {
    chrome.runtime.sendMessage({ name: SERVICE_NAME, code: CONNECT_CODES.BOOKMARKS_CHANGED, data: { type, data } })

    startSync()
  }

  const onCreated: chrome.events.GetEventType<typeof bookmarks.onCreated> = (...args) => {
    change('created', args)
  }

  const onRemoved: chrome.events.GetEventType<typeof bookmarks.onRemoved> = (...args) => {
    change('removed', args)
  }

  const onMoved: chrome.events.GetEventType<typeof bookmarks.onMoved> = (...args) => {
    change('moved', args)
  }

  const onChanged: chrome.events.GetEventType<typeof bookmarks.onChanged> = (...args) => {
    change('changed', args)
  }

  const onImportBegan: chrome.events.GetEventType<typeof bookmarks.onImportBegan> = () => {
    /**
     * 导入书签的时候会一直触发 onCreated and onChange，这里需要先停掉监听，避免高开销
     * @see https://developer.chrome.com/docs/extensions/reference/api/bookmarks?hl=zh-cn#event-onImportBegan
     */

    if (bookmarks.onCreated.hasListener(onCreated)) {
      bookmarks.onCreated.removeListener(onCreated)
    }

    if (bookmarks.onChanged.hasListener(onChanged)) {
      bookmarks.onChanged.removeListener(onChanged)
    }
  }

  const onImportEnded: chrome.events.GetEventType<typeof bookmarks.onImportEnded> = () => {
    // 书签导入完成后继续重启监听 onCreated and onChanged
    if (!bookmarks.onCreated.hasListener(onCreated)) {
      bookmarks.onCreated.addListener(onCreated)
    }

    if (!bookmarks.onChanged.hasListener(onChanged)) {
      bookmarks.onChanged.addListener(onChanged)
    }
  }

  function startListeningBookmarksChanges() {
    console.log('started')
    bookmarks.onCreated.addListener(onCreated)

    bookmarks.onRemoved.addListener(onRemoved)

    bookmarks.onMoved.addListener(onMoved)

    bookmarks.onChanged.addListener(onChanged)

    bookmarks.onImportBegan.addListener(onImportBegan)

    bookmarks.onImportEnded.addListener(onImportEnded)
  }

  // @ts-ignore
  function closeListeningBookmarksChanges() {
    bookmarks.onCreated.removeListener(onCreated)

    bookmarks.onRemoved.removeListener(onRemoved)

    bookmarks.onMoved.removeListener(onMoved)

    bookmarks.onChanged.removeListener(onChanged)

    bookmarks.onImportBegan.removeListener(onImportBegan)

    bookmarks.onImportEnded.removeListener(onImportEnded)
  }

  try {
    browser.runtime.onMessage.addListener(async function (request: any, _, sendResponse) {
      if (request.name !== CLIENT_NAME) return;

      await wait(3000)
      switch (request.code) {
        case CONNECT_CODES.OPEN_AUTO_SYNC:
          await startSync()
          break;
      }

      sendResponse('success')
      return true
    });

    startListeningBookmarksChanges()
    settings = await _getSettings()
  } catch (error) { }
}

