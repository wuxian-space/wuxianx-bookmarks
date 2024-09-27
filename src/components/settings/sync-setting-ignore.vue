<script lang="ts" setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import useSettings from '@/stores/useSettings';
import { getTree } from '@/api/bookmarks';

const visible = defineModel<boolean>('visible', { default: false });

const settingsStore = useSettings();
const { ignores } = storeToRefs(settingsStore);

const bookmarks = ref<chrome.bookmarks.BookmarkTreeNode[]>([]);

getTree().then((res) => {
  bookmarks.value = res;
});
</script>

<template>
  <t-dialog v-model:visible="visible" :z-index="2600" :show-overlay="false" header="设置要忽略同步的书签" width="700px" attach="body">
    <t-tree
      v-model:value="ignores"
      :data="bookmarks"
      :keys="{ value: 'id', label: 'title' }"
      :height="414"
      :scroll="{
        type: 'virtual'
      }"
      :expand-level="1"
      :footer="false"
      valueMode="parentFirst"
      line
      checkable
      @change="settingsStore.updateSettings('ignores')"
    />
  </t-dialog>
</template>
