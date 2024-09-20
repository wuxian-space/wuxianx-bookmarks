declare namespace chrome {
  export namespace bookmarks {
    export interface BookmarkTreeNode extends chrome.bookmarks.BookmarkTreeNode {
      displayedChildren?: BookmarkTreeNode[]
      pinyin?: string
      parentsPath?: BookmarkTreeNode[]
    }

  }

  export namespace events {
    export type GetEventType<T> = T extends chrome.events.Event<infer R> ? R : never;
  }
}