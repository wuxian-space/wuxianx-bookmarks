<script setup lang="ts">
import { ref } from 'vue';
import Settings from '@/components/settings/settings.vue';
import useBookmarks from '@/stores/useBookmarks'

const settingVisible = ref(true);

const bookmarksStore = useBookmarks()

</script>

<template>

  <t-button @click="settingVisible = true">
    <template #icon><setting-icon /></template>
    设置
  </t-button>
  <Settings v-model:visible="settingVisible" />

  <pre>{{ bookmarksStore.bookmarks }}</pre>
</template>
