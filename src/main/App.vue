<script setup lang="ts">
import { ref } from 'vue';
import { getTree } from '@/api/bookmarks';
import { createOrUpdateFileContents } from '@/api/github';

const push = () => {
  createOrUpdateFileContents('const a = 1');
};

const tree = ref([]);

try {
  getTree().then((res: any) => {
    tree.value = res;
  });
} catch (error) {
  console.log(`🚀 > error:`, error);
}
</script>

<template>
  <div>Main App - {{ tree.length }}</div>
  <button @click="push">Push</button>
</template>
