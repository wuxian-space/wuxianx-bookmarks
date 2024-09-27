<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Settings from '@/components/settings/sync-settings.vue';

const targetWin = ref<HTMLIFrameElement>();

const send = async () => {
  const tree = await chrome.bookmarks.getTree();

  targetWin.value?.contentWindow?.postMessage(
    {
      source: 'ext-message',
      data: {
        data: tree,
        type: 'bookmarks-tree'
      }
    },
    '*'
  );
};

chrome.bookmarks.onChanged.addListener(send);

onMounted(() => {
  if (targetWin.value) {
    targetWin.value.onload = (e) => {
      send();
    };
  }
});

const defaultIndex = chrome.runtime.getURL('themes/index.html');
const url = import.meta.env.VITE_DEV_URL;
const src = ref(url ? url : defaultIndex);
</script>

<template>
  <iframe ref="targetWin" class="root-iframe" :src />

  <Settings style="position: fixed; bottom: 155px; right: 15px; width: 40px; height: 40px; border-radius: 6px" size="large" variant="outline" />
</template>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.root-iframe {
  display: block;
  border: 0;
  width: 100%;
  height: 100%;
}
</style>
