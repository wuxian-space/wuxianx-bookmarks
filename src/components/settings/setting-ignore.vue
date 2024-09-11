<script lang="ts" setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import useSettings from '@/stores/useSettings';
import useBookmarks from '@/stores/useBookmarks';

const visible = defineModel<boolean>('visible', { default: false });

const settingsStore = useSettings();
const { ignores } = storeToRefs(settingsStore);

const bookmarksStore = useBookmarks();
</script>

<template>
  <t-dialog v-model:visible="visible" :z-index="2600" :show-overlay="false" header="设置要忽略同步的书签" width="700px" attach="body">
    <t-tree
      v-model:value="ignores"
      :data="bookmarksStore.bookmarks"
      :keys="{ value: 'id', label: 'title' }"
      :height="414"
      :scroll="{
        type: 'virtual'
      }"
      :expand-level="1"
      valueMode="parentFirst"
      line
      checkable
    />

    <template #confirmBtn></template>
    <template #cancelBtn></template>
  </t-dialog>
</template>

<style scoped>
.tdesign-tree-line .custom-line {
  display: flex;
  position: absolute;
  top: 2px;
  left: 9px;
}
.tdesign-tree-line .custom-line-box {
  display: flex;
  flex: 0 0 auto;
}
.tdesign-tree-line .custom-line span {
  position: relative;
  flex: 0 0 auto;
  width: 24px;
  height: 40px;
}
.tdesign-tree-line .custom-line span:last-child:before {
  content: '';
  position: absolute;
  display: block;
  bottom: 22px;
  left: 6px;
  width: 12px;
  height: 26px;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #0052d9;
}
.tdesign-tree-line .custom-line-leaf span:last-child:before {
  width: 16px;
}
.tdesign-tree-line .custom-line-cross:before {
  content: '';
  display: block;
  position: absolute;
  left: 6px;
  top: -15px;
  height: 44px;
  width: 1px;
  border-left: 1px solid #ddd;
}
.tdesign-tree-line .custom-line-icon {
  position: absolute;
  top: 10px;
  right: -14px;
  display: flex;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  border: 1px solid #0052d9;
  background-color: #fff;
  justify-content: center;
  align-items: center;
}
.tdesign-tree-line .custom-line span:last-child:after {
  content: '';
  position: absolute;
  display: block;
  box-sizing: border-box;
  top: 14px;
  left: 3px;
  z-index: 1;
  width: 7px;
  height: 7px;
  border-radius: 2px;
  border: 1px solid #0052d9;
  background-color: #fff;
  transform: rotate(45deg);
  transform-origin: 50% 50%;
}
</style>
