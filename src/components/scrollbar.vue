<script setup lang="ts">
import { bem } from '@/utils/class-name';
const b = bem('scrollbar');

const { tag = 'div', scrollbarWidth = 5 } = defineProps<{
  tag?: string;
  scrollbarWidth?: number;
}>();
</script>

<template>
  <component :is="tag" :class="b()" :style="{ '--scrollbar-width': scrollbarWidth + 'px' }">
    <slot />
  </component>
</template>

<style lang="scss">
.#{b(scrollbar)} {
  @include scrollbar(#{var(--scrollbar-width)});
}
</style>
