<script setup lang="ts">
import useBookmarks from '@/stores/useBookmarks';
import Scrollbar from '@/components/scrollbar.vue';
import { bem } from '@/utils/class-name';
import type { AnchorProps } from 'tdesign-vue-next';

const b = bem('theme-layout-aside');

const bookmarksStore = useBookmarks();

const onAnchorItemClick: AnchorProps['onClick'] = ({ e }) => {
  e.preventDefault();
};
</script>

<template>
  <Scrollbar ref="default-theme-aside" :class="b()">
    <TAnchor :class="b('anchor')" :bounds="50" container=".b-theme-layout__main" @click="onAnchorItemClick">
      <div v-for="menus in bookmarksStore.bookmarks" :class="b('group')">
        <div :class="b('group-name')">{{ menus.title }}</div>
        <nav :class="b('group-nav')" container=".b-theme-layout__main">
          <template v-for="menu in menus.children">
            <div class="t-anchor__item" v-if="menu.url">
              <a :href="menu.url" :title="menu.title" class="t-anchor__item-link" target="_blank">
                {{ menu.title }}
                <ArrowRightUpIcon />
              </a>
            </div>
            <t-anchor-item v-else :href="`#${menu.id}`" :title="menu.title" />
          </template>
        </nav>
      </div>
    </TAnchor>
  </Scrollbar>
</template>

<style lang="scss">
.#{b(theme-layout-aside)} {
  padding: 15px 15px 15px 0;
  width: var-value(aside-width);
  background: var-value(aside-bg-color);
  color: var-value(aside-text-color);
  border-right: 1px solid var-value(border-color);

  &__group {
    margin-bottom: 15px;

    &-name {
      padding-left: 15px;
      font-size: 12px;
      font-weight: bold;
      color: var-value(aside-text-color);
    }
  }

  &__anchor {
    width: 100%;
    background: transparent;

    .t-anchor__item {
      min-height: var-value(aside-item-min-height);
      justify-content: center;
    }

    .t-anchor__item-link {
      color: var-value(aside-item-color);

      .t-icon {
        margin-left: 3px;
        width: auto;
        height: 1.3em;
        color: var(--b-aside-active-item-color);
      }
    }

    .t-is-active > a {
      color: var-value(aside-active-item-color);
    }

    a:hover {
      color: var-value(aside-active-item-color);
    }

    .t-anchor__line {
      width: 0;

      .t-anchor__line-cursor-wrapper {
        left: 3px;
      }

      .t-anchor__line-cursor {
        width: 3px;
        background-color: var-value(aside-active-item-color);
      }
    }
  }
}
</style>
