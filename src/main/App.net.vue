<script setup lang="ts">
import { ref } from 'vue';
import { getTree } from '@/api/bookmarks';

const tree = ref([]);

try {
  getTree().then((res: any) => {
    console.log(`🚀 > getTree > res:`, res);
    tree.value = res;
  });
} catch (error) {
  console.log(`🚀 > error:`, error);
}
</script>

<template>
  <pre>{{ tree }}</pre>
</template>
