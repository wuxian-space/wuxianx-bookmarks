import { debounce } from 'lodash-es'
import { getTree } from '@/api/bookmarks';
import { upsertBookmarksData } from '@/api/github';
import { CONNECT_CODES, BACKGROUND_CONNECT_NAME, SYNC_DELAY } from '@/constants'
import { _getSettings, Settings } from '@/stores/useSettings';
import { toSyncBookmarks } from '@/common';


export default async function () {
  const bookmarks = chrome.bookmarks

  let settings: Settings

  const syncTree = async () => {
    const tree = await getTree()
    const syncTree = toSyncBookmarks(tree, settings?.ignores)
    await upsertBookmarksData(JSON.stringify(syncTree));
  }

  const change = debounce(async (type: 'created' | 'removed' | 'moved' | 'changed' | 'childrenReordered', data?: any) => {
    console.log(`🚀 > background-script -> bookmarks ${type}.`, data);

    chrome.action.setBadgeText({ text: '...' })

    await syncTree()

    chrome.action.setBadgeText({ text: '' })
  }, SYNC_DELAY)

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
    if (!settings?.githubToken) return;

    bookmarks.onCreated.addListener(onCreated)

    bookmarks.onRemoved.addListener(onRemoved)

    bookmarks.onMoved.addListener(onMoved)

    bookmarks.onChanged.addListener(onChanged)

    bookmarks.onImportBegan.addListener(onImportBegan)

    bookmarks.onImportEnded.addListener(onImportEnded)
  }

  function closeListeningBookmarksChanges() {
    bookmarks.onCreated.removeListener(onCreated)

    bookmarks.onRemoved.removeListener(onRemoved)

    bookmarks.onMoved.removeListener(onMoved)

    bookmarks.onChanged.removeListener(onChanged)

    bookmarks.onImportBegan.removeListener(onImportBegan)

    bookmarks.onImportEnded.removeListener(onImportEnded)
  }

  chrome.runtime.onConnect.addListener(port => {
    if (port.name !== BACKGROUND_CONNECT_NAME) return;

    port.onMessage.addListener(function (msg) {
      switch (msg.code) {
        case CONNECT_CODES.OPEN_AUTO_SYNC:
          startListeningBookmarksChanges()
          break;
        case CONNECT_CODES.CLOSE_AUTO_SYNC:
          closeListeningBookmarksChanges()
          break;
        case CONNECT_CODES.START_SYNC:
          syncTree()
          break;
      }
    });
  })

  try {
    settings = await _getSettings()
    if (settings?.autoSync) {
      startListeningBookmarksChanges()
    }
  } catch (error) { }
}

