<script setup lang="ts">
import { ref } from 'vue';
import { getTree } from '@/api/bookmarks';

const tree = ref([]);

getTree().then((res: any) => {
  tree.value = res;
});
</script>

<template>
  <div>Main App - {{ tree.length }}</div>
</template>
