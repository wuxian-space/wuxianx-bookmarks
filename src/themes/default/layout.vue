<script setup lang="ts">
import { setLayoutCssVars } from '@/hooks/useCssVariables';
import { bem } from '@/utils/class-name';
import LayoutMain from './main.vue';
import LayoutAside from './aside.vue';
import LayoutHeader from './header.vue';

const b = bem('theme-layout');

setLayoutCssVars().setLayout();
</script>

<template>
  <div ref="default-theme-layout" :class="b()">
    <LayoutHeader :class="b('header')" />
    <LayoutAside :class="b('aside')" />
    <LayoutMain :class="b('main')" />
  </div>
</template>

<style lang="scss">
.#{b(theme-layout)} {
  position: relative;
  width: 100vw;
  height: 100vh;

  &__header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  &__aside {
    position: absolute;
    top: var-value(header-height);
    left: 0;
    height: calc(100% - var-value(header-height));
  }

  &__main {
    position: absolute;
    left: var-value(aside-width);
    top: var-value(header-height);
    right: 0;
    height: calc(100% - var-value(header-height));
  }
}
</style>
