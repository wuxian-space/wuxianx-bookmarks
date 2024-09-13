<script setup lang="ts">
import { bem } from '@/utils/class-name';

const b = bem('theme-layout-footer');
</script>

<template>
  <div :class="b()">theme-footer</div>
</template>

<style lang="scss">
  .#{b(theme-layout-footer)} {
    padding: 15px 0;
  }
</style>