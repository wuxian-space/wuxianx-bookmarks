<script setup lang="ts">
import { ref } from 'vue';
import { setLayoutCssVars } from '@/hooks/useCssVariables';
import { bem } from '@/utils/class-name';
import LayoutMain from './main.vue';
import LayoutAside from './aside.vue';
import LayoutHeader from './header.vue';

const b = bem('theme-layout');

setLayoutCssVars().setLayout();

const asideFold = ref(false);
</script>

<template>
  <div ref="default-theme-layout" :class="b()">
    <LayoutHeader :class="b('header')" />
    <LayoutAside :class="[b('aside'), { 'is-fold': asideFold }]" />
    <LayoutMain :class="b('main')" />

    <span :class="[b('aside-toggle'), { 'is-fold': asideFold }]" @click="asideFold = !asideFold">
      <AdjustmentIcon />
    </span>

    <t-back-top theme="primary" size="small" container=".b-theme-layout__main" :class="b('back-top')"></t-back-top>
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
    z-index: 999;
    height: calc(100% - var-value(header-height));
    transition: left 0.3s ease-in-out;
  }

  &__aside-toggle {
    display: none;
  }

  &__main {
    position: absolute;
    left: var-value(aside-width);
    top: var-value(header-height);
    right: 0;
    height: calc(100% - var-value(header-height));
  }

  &__back-top {
    width: 40px !important;
    height: 40px !important;
    inset-inline-end: 15px !important;
    inset-block-end: 100px !important;
  }

  @media (max-width: 768px) {
    &__aside {
      left: calc(-1 * #{var-value(aside-width)});

      &.is-fold {
        left: 0;
      }
    }

    &__aside-toggle {
      @include flex-center;

      position: fixed;
      right: 15px;
      bottom: 150px;
      z-index: 999;
      width: 40px;
      height: 40px;
      font-size: 20px;
      background-color: var(--td-font-white-1);
      color: var(--td-brand-color);
      border: 1px solid var(--td-brand-color);
      border-radius: var(--td-radius-medium);
      cursor: pointer;
      transition: all 0.3s ease-in-out;

      &.is-fold {
        background-color: var(--td-brand-color);
        color: var(--td-font-white-1);
      }
    }

    &__main {
      left: 0;
    }
  }
}
</style>
