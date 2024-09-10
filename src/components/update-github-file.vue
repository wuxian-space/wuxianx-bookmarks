<script setup lang="ts">
import { createOrUpdateFileContents } from '@/api/github';

const props = defineProps({
  content: String
});

const push = () => {
  createOrUpdateFileContents(JSON.stringify(props.content));
};
</script>

<template>
  <button @click="push">Push</button>
</template>
