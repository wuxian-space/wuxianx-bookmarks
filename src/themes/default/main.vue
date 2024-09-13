<script setup lang="ts">
import { ref } from 'vue';
import Settings from '@/components/settings/settings.vue';
import Scrollbar from '@/components/scrollbar.vue';
import useBookmarks from '@/stores/useBookmarks';
import ThemeFooter from './footer.vue';

import { bem } from '@/utils/class-name';

const b = bem('theme-layout-main');

const settingVisible = ref(false);

const bookmarksStore = useBookmarks();
</script>

<template>
  <Scrollbar :class="b()">
    <t-button @click="settingVisible = true">
      <template #icon><setting-icon /></template>
      设置
    </t-button>
    <Settings v-model:visible="settingVisible" />

    <pre>{{ bookmarksStore.bookmarks }}</pre>

    <ThemeFooter />
  </Scrollbar>
</template>

<style lang="scss">
.#{b(theme-layout-main)} {
  background: #f5f5f5;
}
</style>
