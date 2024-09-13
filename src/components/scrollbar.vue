<script setup lang="ts">
import { bem } from '@/utils/class-name';
const { height = '100%' } = defineProps<{
  height?: string;
}>();

const b = bem('scrollbar')
</script>

<template>
  <div :class="b()">
    <slot />
  </div>
</template>

<style lang="scss">
.#{b(scrollbar)} {
  height: v-bind(height);
  @include scrollbar;
}
</style>
