import type { Bookmarks } from 'webextension-polyfill';

import { Settings } from '@/stores/useSettings';

export function toSyncBookmarks(bookmarks: Bookmarks.BookmarkTreeNode[], ignores: Settings['ignores']) {
  return bookmarks.filter(node => !ignores?.includes(node.id)).map((_node) => {
    const { id, parentId, title, url, children } = _node

    const result = {
      id, parentId, title, url, children
    };

    if (Array.isArray(children)) {
      result.children = toSyncBookmarks(children, ignores);
    }

    return result;
  });
}