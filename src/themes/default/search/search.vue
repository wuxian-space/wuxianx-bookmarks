<script setup lang="ts">
import { throttle } from 'lodash-es';
import { computed, watch, ref, useAttrs, nextTick, useTemplateRef } from 'vue';
import { bem } from '@/utils/class-name';
import Scrollbar from '@/components/scrollbar.vue';
import useBookmarks, { type BookmarkNode } from '@/stores/useBookmarks';
import { useMagicKeys, whenever } from '@vueuse/core';

const b = bem('search');
const attrs = useAttrs();

const bookmarksStore = useBookmarks();

const visible = defineModel<boolean>('visible', { default: false });

const { ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown') e.preventDefault();
  }
});
whenever(ctrl_k, () => {
  visible.value = !visible.value;
});

const keywordInputRef = useTemplateRef<HTMLInputElement>('keyword-input');
const keyword = ref('');
watch(visible, async (val) => {
  if (!val) {
    keyword.value = '';
    return;
  }

  await nextTick();
  keywordInputRef.value?.focus();
});

const onSearch = throttle((val) => {
  keyword.value = val;
}, 80);

const searchResult = computed<BookmarkNode[]>(() => {
  if (!keyword.value) return [];

  return bookmarksStore.flatBookmarks.filter((item) => {
    const isIncludes = item.title.includes(keyword.value) || item?.pinyin?.includes(keyword.value.toLocaleLowerCase());

    return isIncludes && item.url;
  });
});
</script>

<template>
  <button :class="b()" @click="visible = true">
    <SearchIcon />
    <span :class="b('text')">搜索</span>
    <b :class="b('key')">Ctrl K</b>
  </button>

  <t-dialog v-model:visible="visible" v-bind="attrs" :close-btn="false" :header="false" :footer="false" width="600px" attach="body" :class="b('dialog')">
    <t-input ref="keyword-input" :value="keyword" placeholder="请输入名称 or 拼音" size="large" :class="b('input')" clearable @change="onSearch">
      <template #prefixIcon>
        <search-icon />
      </template>

      <template #suffix v-if="searchResult.length"> 共 {{ searchResult.length }} 条结果 </template>
    </t-input>

    <Scrollbar :class="b('result-list')" :scrollbar-width="0">
      <a v-for="item in searchResult" :href="item.url" target="_blank" :class="b('result-list__item')">
        <span> {{ item.title }} </span>

        <t-breadcrumb v-if="item.parentsPath?.length">
          <t-breadcrumb-item v-for="b in item.parentsPath" disabled>
            {{ b.title }}
          </t-breadcrumb-item>
        </t-breadcrumb>
      </a>
    </Scrollbar>
  </t-dialog>
</template>

<style lang="scss">
.#{b(search)} {
  @include flex-center(y);

  margin-left: 30px;
  padding: 0 15px;
  line-height: var-value(search-button-height);
  background-color: var-value(search-button-bg-color);
  color: var-value(search-button-color);
  font-size: var-value(search-button-font-size);
  border-radius: var-value(search-button-border-radius);
  border: 1px solid var-value(search-button-border-color);
  transition: all 0.3s ease;
  cursor: pointer;

  &__text {
    margin: 0 10px 0 5px;
  }

  &:hover {
    background-color: var-value(search-button-hover-bg-color);
    border-color: var-value(search-button-hover-border-color);
    color: var-value(search-button-hover-color);
  }

  &__dialog {
    .t-dialog {
      padding: 15px;
    }

    .t-dialog__body {
      padding: 0;
    }
  }

  &__input {
    .t-input__suffix {
      color: var(--td-text-color-placeholder);
      font-size: 12px;
    }
  }

  &__result-list {
    padding: 0;
    margin: 0;
    max-height: 400px;
    list-style-type: none;

    &__item {
      display: block;
      padding: 10px;
      margin-top: 10px;
      background-color: var-value('search-result-item-bg-color');
      border-radius: var-value('search-result-item-border-radius');
      border: 1px solid var-value('search-result-item-border-color');
      transition: all 0.3s ease;
      color: var-value('search-result-item-color');
      text-decoration: none;

      &:hover {
        background-color: var-value('search-result-item-hover-bg-color');
        color: var-value('search-result-item-hover-color');
        border-color: var-value('search-result-item-hover-border-color');
      }
    }
  }
}
</style>
