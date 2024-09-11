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
    return children.filter(node => !ignores.value.includes(node.id)).map((node) => {
      const result = {
        ...node
      };

      if (Array.isArray(node.children)) {
        result.children = calcTree(node.children);
      }

      return result;
    });
  }
})
