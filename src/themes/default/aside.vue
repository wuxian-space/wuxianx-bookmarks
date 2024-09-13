<script setup lang="ts">
import Scrollbar from '@/components/scrollbar.vue';
import { setLayoutCssVars } from '@/hooks/useCssVariables';
import { bem } from '@/utils/class-name';

const b = bem('theme-layout-aside');
setLayoutCssVars().setAside();
</script>

<template>
  <Scrollbar ref="default-theme-aside" :class="b()">
    <header :class="b('header')">header</header>
  </Scrollbar>
</template>

<style lang="scss">
.#{b(theme-layout-aside)} {
  width: var-value(aside-width);
  background: var-value(aside-bg-color);
  color: var-value(aside-text-color);
}
</style>
