<script setup lang="ts">
import { bem } from '@/utils/class-name';
const b = bem('scrollbar')
</script>

<template>
  <div :class="b()">
    <slot />
  </div>
</template>

<style lang="scss">
.#{b(scrollbar)} {
  @include scrollbar;
}
</style>
