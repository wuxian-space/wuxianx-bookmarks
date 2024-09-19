<script setup lang="ts">
import Scrollbar from '@/components/scrollbar.vue';
import useBookmarks from '@/stores/useBookmarks';
import ThemeFooter from './footer.vue';

import { bem } from '@/utils/class-name';

const b = bem('theme-layout-main');

const bookmarksStore = useBookmarks();
</script>

<template>
  <Scrollbar :class="b()">
    <section v-for="(menus, index) in bookmarksStore.bookmarks" :class="b('group')">
      <div v-for="menu in menus.children?.filter((menu) => !menu.url)" :id="menu.id" :class="b('links')">
        <div v-if="index > 0" :class="b('group-name')">{{ menus.title }}</div>

        <t-card :title="menu.title" header-bordered>
          <t-space break-line>
            <template v-for="item in menu.children">
              <a v-if="item.url" :href="item.url" :title="item.title" :class="b('link')" target="_blank">
                {{ item.title }}
              </a>

              <span v-else :title="item.title" :class="b('link')">
                <FolderIcon />
                {{ item.title }}
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
