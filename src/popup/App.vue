<script setup lang="ts">
function toHome() {
  const home = chrome.runtime.getURL('index.html');

  chrome.tabs.create({
    url: home
  });
}
</script>

<template>
  <button @click="toHome">To Home</button>
</template>
