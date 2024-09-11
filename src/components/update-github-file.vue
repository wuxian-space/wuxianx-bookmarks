<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { upsertBookmarksData } from '@/api/github';

const props = defineProps<{
  content: any;
}>();

const loading = ref(false);

const push = async () => {
  loading.value = true;
  try {
    await upsertBookmarksData(JSON.stringify(props.content));
  } finally {
    loading.value = false;
  }
};

const attrs = useAttrs();
</script>

<template>
  <t-button v-bind="attrs" @click="push" :loading="loading">
    <template #icon><cloud-upload-icon /></template>
    同步
  </t-button>
</template>
