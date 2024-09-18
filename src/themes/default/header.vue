<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { storeToRefs } from 'pinia';
import Settings from '@/components/settings/settings.vue';
import useThemeConfig from '@/stores/useThemeConfig';
import { bem } from '@/utils/class-name';

const attrs = useAttrs();

const b = bem('theme-layout-header');
const themeConfigStore = useThemeConfig();
const { logo, title } = storeToRefs(themeConfigStore);

const settingVisible = ref(false);
</script>

<template>
  <div v-bind="attrs" :class="b()">
    <img :class="b('logo')" :src="logo" alt="logo" />
    <h1 :class="b('title')">{{ title }}</h1>

    <t-button style="margin-left: auto" shape="circle" size="medium" theme="primary" variant="text" @click="settingVisible = true">
      <template #icon><setting-icon /></template>
    </t-button>
  </div>

  <Settings v-model:visible="settingVisible" />
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
