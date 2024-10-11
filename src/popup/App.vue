<script setup lang="ts">
import browser from 'webextension-polyfill'
function toHome() {
  const home = browser.runtime.getURL('index.html');
  window.open(home, '_blank');
}

browser.action.onClicked.addListener(toHome);
</script>

<template>
  <t-button @click="toHome">To Home</t-button>
</template>
