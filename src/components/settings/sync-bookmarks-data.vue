<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { upsertBookmarksData } from '@/api/github';
import useBookmarks from '@/stores/useBookmarks';

const loading = ref(false);

const bookmarksStore = useBookmarks();

const push = async () => {
  loading.value = true;
  try {
    await upsertBookmarksData(JSON.stringify(bookmarksStore.syncableBookmarks));
  } finally {
    loading.value = false;
  }
};

const attrs = useAttrs();
</script>

<template>
  <t-button v-bind="attrs" @click="push" :loading="loading">
    <template #icon><cloud-upload-icon /></template>
    同步
  </t-button>
</template>
