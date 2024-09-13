<script setup lang="ts">
import { setLayoutCssVars } from '@/hooks/useCssVariables';
import { bem } from '@/utils/class-name';
import LayoutMain from './main.vue';
import LayoutAside from './aside.vue';

const b = bem('theme-layout');

setLayoutCssVars().setLayout();
</script>

<template>
  <div ref="default-theme-layout" :class="b()">
    <LayoutAside :class="b('aside')" />
    <LayoutMain :class="b('main')" />
  </div>
</template>

<style lang="scss">
.#{b(theme-layout)} {
  position: relative;
  width: 100vw;
  height: 100vh;

  &__aside {
    position: absolute;
    top: 0;
    left: 0;
  }

  &__main {
    position: absolute;
    left: var-value(aside-width);
    top: 0;
    right: 0;
  }
}
</style>
