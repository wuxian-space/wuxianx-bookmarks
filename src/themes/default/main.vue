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
      <div v-for="menu in menus.children?.filter(menu => !menu.url)" :id="menu.id" :class="b('links')">
        <div v-if="index > 0" :class="b('group-name')">{{ menus.title }}</div>

        <t-card :title="menu.title" header-bordered>
          <t-space break-line>
            <t-link v-for="item in menu.children" :href="item.url" :title="item.title" :class="b('link')" target="_blank">
              {{ item.title }}
            </t-link>
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
}
</style>
