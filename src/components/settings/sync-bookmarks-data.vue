<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { upsertBookmarksData } from '@/api/github';
import useSettings from '@/stores/useSettings';
import { toSyncBookmarks } from '@/common';
import { getTree } from '@/api/bookmarks';

const settingsStore = useSettings();

const loading = ref(false);
const push = async () => {
  loading.value = true;
  try {
    const tree = await getTree()
    const syncTree = toSyncBookmarks(tree, settingsStore.ignores)
    await upsertBookmarksData(JSON.stringify(syncTree));
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
