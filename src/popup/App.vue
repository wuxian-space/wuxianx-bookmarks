<script setup lang="ts">
function toHome() {
  const home = chrome.runtime.getURL('index.html');

  window.open(home, '_blank');
}
</script>

<template>
  <t-button @click="toHome">To Home</t-button>
</template>
