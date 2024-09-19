import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getTree } from '@/api/bookmarks';
import { storeToRefs } from 'pinia';
import useSettings from '@/stores/useSettings';

export type BookmarkNode = chrome.bookmarks.BookmarkTreeNode

export default defineStore('bookmarks', () => {
  const settingsStore = useSettings();
  const { ignores } = storeToRefs(settingsStore);

  const bookmarks = ref<BookmarkNode[]>([])

  const syncableBookmarks = computed(() => {
    return calcTree(bookmarks.value)
  })

  getBookmarks()
  async function getBookmarks() {
    bookmarks.value = await getTree()
  }

  return {
    bookmarks,
    syncableBookmarks,
    getBookmarks,
  }

  function calcTree(children: BookmarkNode[]) {
    return children.filter(node => !ignores.value.includes(node.id)).map((_node) => {
      const { id, parentId, title, url, children } = _node

      const result = {
        id, parentId, title, url, children
      };

      if (Array.isArray(children)) {
        result.children = calcTree(children);
      }

      return result;
    });
  }
})
