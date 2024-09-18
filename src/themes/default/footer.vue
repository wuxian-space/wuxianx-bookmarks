<script setup lang="ts">
import { bem } from '@/utils/class-name';

const b = bem('theme-layout-footer');
</script>

<template>
  <div :class="b()">
    <div :class="b('copyright')">© {{ new Date().getFullYear() }} 使用 <a href="https://github.com/yuexiaoliang/browser-bookmarks-page" target="_blank" ref="noopener noreferrer nofollow">无限书签</a> 构建</div>
  </div>
</template>

<style lang="scss">
.#{b(theme-layout-footer)} {
  padding: 15px 0;
  color: var(--td-text-color-secondary);

  &__copyright {
    text-align: center;
  }
}
</style>
