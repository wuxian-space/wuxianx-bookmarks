<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import useSettings from '@/stores/useSettings';
import useBookmarks from '@/stores/useBookmarks';

const visible = defineModel<boolean>('visible', { default: false });

const settingsStore = useSettings();
const { ignores } = storeToRefs(settingsStore);

const bookmarksStore = useBookmarks();
</script>

<template>
  <t-dialog v-model:visible="visible" :z-index="2600" :show-overlay="false" header="设置要忽略同步的书签" width="700px" attach="body">
    <t-tree
      v-model:value="ignores"
      :data="bookmarksStore.bookmarks"
      :keys="{ value: 'id', label: 'title' }"
      :height="414"
      :scroll="{
        type: 'virtual'
      }"
      :expand-level="1"
      valueMode="parentFirst"
      line
      checkable
      @change="settingsStore.updateSettings('ignores')"
    />

    <template #confirmBtn></template>
    <template #cancelBtn></template>
  </t-dialog>
</template>
