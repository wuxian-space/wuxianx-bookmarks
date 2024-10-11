<script setup lang="ts">
import { ref, onMounted } from 'vue';
import browser from 'webextension-polyfill'
import Settings from '@/components/settings/sync-settings.vue';
import { CONNECT_CODES, SERVICE_NAME } from '@/constants';

browser.runtime.onMessage.addListener(function (request) {
  if (request.name !== SERVICE_NAME) return;
  console.log(`🚀 > request:`, request);

  switch (request.code) {
    case CONNECT_CODES.BOOKMARKS_CHANGED:
      send();
      break;
  }

  return true
});

const targetWin = ref<HTMLIFrameElement>();

onMounted(() => {
  if (targetWin.value) {
    targetWin.value.onload = () => {
      send();
    };
  }
});

const defaultIndex = browser.runtime.getURL('themes/index.html');
const url = import.meta.env.VITE_DEV_URL;
const src = ref(url ? url : defaultIndex);

async function send() {
  const tree = await browser.bookmarks.getTree();

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
}
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
