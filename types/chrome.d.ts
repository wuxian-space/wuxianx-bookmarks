declare namespace chrome {
  export namespace bookmarks {
    export interface BookmarkTreeNode extends chrome.bookmarks.BookmarkTreeNode {
      displayedChildren?: BookmarkTreeNode[];
    }
  }
}