<script setup lang="ts">
import { ref } from 'vue';
import { getTree } from '@/api/bookmarks';
import Settings from '@/components/settings/settings.vue';

const settingVisible = ref(false);

const tree = ref([]);

try {
  // getTree().then((res: any) => {
  //   console.log(`🚀 > getTree > res:`, res);
  //   tree.value = res;
  // });
} catch (error) {
  console.log(`🚀 > error:`, error);
}
</script>

<template>

  <t-button @click="settingVisible = true">
    <template #icon><setting-icon /></template>
    设置
  </t-button>
  <Settings v-model:visible="settingVisible" />

  <pre>{{ tree }}</pre>
</template>
