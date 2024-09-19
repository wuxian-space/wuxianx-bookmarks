<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { storeToRefs } from 'pinia';
import Settings from '@/components/settings/sync-settings.vue';
import useThemeConfig from '@/stores/useThemeConfig';
import { bem } from '@/utils/class-name';

const attrs = useAttrs();

const b = bem('theme-layout-header');
const themeConfigStore = useThemeConfig();
const { logo, title } = storeToRefs(themeConfigStore);
</script>

<template>
  <div v-bind="attrs" :class="b()">
    <img :class="b('logo')" :src="logo" alt="logo" />
    <h1 :class="b('title')">{{ title }}</h1>

    <Settings />
  </div>
</template>

<style lang="scss" scoped>
.#{b(theme-layout-header)} {
  @include flex-center(y);
  padding: 0 20px;
  height: var-value(header-height);
  background: var-value(header-bg-color);
  color: var-value(header-text-color);
  border-bottom: 1px solid var-value(border-color);

  &__logo {
    height: 60%;
    max-height: 30px;
    margin-right: 10px;
  }

  &__title {
    margin: 0;
    font-size: var-value(header-title-font-size);
  }
}
</style>
