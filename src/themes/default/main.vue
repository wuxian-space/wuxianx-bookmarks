<script setup lang="ts">
import { ref } from 'vue';
import Scrollbar from '@/components/scrollbar.vue';
import useBookmarks, { BookmarkNode } from '@/stores/useBookmarks';
import ThemeFooter from './footer.vue';

import { bem } from '@/utils/class-name';

const b = bem('theme-layout-main');

const bookmarksStore = useBookmarks();

const breadcrumbs = ref<Record<string, BookmarkNode[]>>({});

const onFolderClick = (folder: BookmarkNode, block: BookmarkNode) => {
  const { id: blockId } = block;

  if (!breadcrumbs.value[blockId]) {
    breadcrumbs.value[blockId] = [block];
  }

  breadcrumbs.value[blockId].push(folder);
  block.displayedChildren = folder.children;
};

const onBreadcrumbItemClick = (bm: BookmarkNode, block: BookmarkNode) => {
  const { id: blockId } = block;
  const breadcrumb = breadcrumbs.value[blockId];

  const bmIndex = breadcrumb.findIndex((item) => item.id === bm.id);

  breadcrumb.splice(bmIndex + 1);

  if (breadcrumb?.length <= 1) {
    delete block.displayedChildren;
    delete breadcrumbs.value[blockId];
  } else {
    block.displayedChildren = bm.children;
  }
};
</script>

<template>
  <Scrollbar :class="b()">
    <section v-for="(blocks, index) in bookmarksStore.bookmarks" :class="b('group')">
      <div v-for="block in blocks.children?.filter((menu) => !menu.url)" :id="block.id" :class="b('links')">
        <div v-if="index > 0" :class="b('group-name')">{{ blocks.title }}</div>

        <t-card :title="block.title" header-bordered>
          <t-breadcrumb v-if="breadcrumbs[block.id]" style="margin-bottom: 10px">
            <t-breadcrumb-item v-for="(item, index) in breadcrumbs[block.id]" @click="onBreadcrumbItemClick(item, block)">
              <template v-if="index === 0" #icon>
                <FolderOpenIcon />
              </template>
              {{ item.title }}
            </t-breadcrumb-item>
          </t-breadcrumb>

          <t-space break-line>
            <template v-for="bm in block.displayedChildren || block.children">
              <a v-if="bm.url" :href="bm.url" :title="bm.title" :class="b('link')" target="_blank">
                {{ bm.title }}
              </a>

              <span v-else :title="bm.title" :class="b('link')" @click="onFolderClick(bm, block)">
                <FolderIcon />
                {{ bm.title }}
              </span>
            </template>
          </t-space>
        </t-card>
      </div>
    </section>

    <ThemeFooter />
  </Scrollbar>
</template>

<style lang="scss">
.#{b(theme-layout-main)} {
  padding: 0 20px;

  &__group {
    &-name {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: bold;
      color: #ccc;
    }
  }

  &__links {
    padding-top: 20px;

    .t-space, .t-space-item {
      max-width: 100%;
    }
  }

  &__link {
    @include ellipsis;

    display: inline-block;
    padding-left: var-value(link-padding-left);
    padding-right: var-value(link-padding-right);
    max-width: var-value(link-max-width);
    min-width: var-value(link-min-width);
    height: var-value(link-height);
    line-height: var-value(link-height);
    color: var-value(link-color);
    background: var-value(link-bg-color);
    text-align: var-value(link-align);
    border-radius: var-value(link-radius);
    border-width: var-value(link-border-width);
    border-style: var-value(link-border-style);
    border-color: var-value(link-border-color);
    text-decoration: none;
    transition: all 0.2s linear;
    cursor: pointer;

    .t-icon {
      color: var-value(link-icon-color);
    }

    &:hover {
      background: var-value(link-hover-bg-color);
      color: var-value(link-hover-color);
      border-color: var-value(link-hover-border-color);

      .t-icon: {
        color: var-value(link-hover-icon-color);
      }
    }
  }
}
</style>
