<script setup lang="ts">
import { ref, useTemplateRef, useAttrs } from 'vue';
import { storeToRefs } from 'pinia';
import SyncBookmarksData from '@/components/settings/sync-bookmarks-data.vue';
import SettingIgnore from './sync-setting-ignore.vue';
import useSettings from '@/stores/useSettings';
import { bem } from '@/utils/class-name';

const b = bem('sync-settings');

const visible = defineModel<boolean>('visible', { default: false });

const settingsStore = useSettings();
const { updateSettings } = settingsStore;
const { userSettings, githubError } = storeToRefs(settingsStore);

const formRef = useTemplateRef('formRef');

const ignoreVisible = ref(false);

const attrs = useAttrs();
</script>

<template>
  <t-dialog v-model:visible="visible" :footer="false" header="同步设置" width="700px" attach="body">
    <template #body>
      <t-form ref="formRef">
        <t-form-item label="忽略">
          <t-button size="small" @click="ignoreVisible = true">
            <template #icon><bookmark-add-icon /></template>
            调整
          </t-button>
          <SettingIgnore v-model:visible="ignoreVisible" />
        </t-form-item>

        <t-divider align="left">同步到 GitHub</t-divider>

        <t-form-item v-if="!!githubError">
          <t-alert theme="error" style="width: 100%">{{ githubError }}</t-alert>
        </t-form-item>

        <t-form-item label="地址">
          <t-input v-model="userSettings.url" @blur="updateSettings('url')" />
        </t-form-item>

        <t-form-item label="密钥">
          <t-input v-model="userSettings.githubToken" type="password" @blur="updateSettings('githubToken')" />
        </t-form-item>

        <t-form-item label="昵称">
          <t-input v-model="userSettings.githubAuthorName" @blur="updateSettings('githubAuthorName')" />
        </t-form-item>

        <t-form-item label="邮箱">
          <t-input v-model="userSettings.githubAuthorEmail" @blur="updateSettings('githubAuthorEmail')" />
        </t-form-item>

        <t-form-item label="自动">
          <t-switch v-model="userSettings.autoSync" @change="updateSettings('autoSync')" />
          <span :class="b('auto-sync-hint')">
            创建、删除、移动、修改都会触发自动同步
            <t-tooltip content="导入书签后需要手动同步">
              <InfoCircleIcon />
            </t-tooltip>
          </span>
        </t-form-item>

        <t-form-item>
          <SyncBookmarksData :disabled="!!githubError" block />
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
  <slot>
    <t-button v-bind="attrs" style="margin-left: auto" shape="circle" size="medium" theme="primary" variant="text" @click="visible = true">
      <template #icon><cloud-upload-icon /></template>
    </t-button>
  </slot>
</template>

<style lang="scss">
.#{b(sync-settings)} {
  &__auto-sync-hint {
    @include flex-center(y);
    margin-left: 10px;
    font-size: 12px;
    color: var(--td-text-color-placeholder);

    .t-icon {
      margin-left: 5px;
      font-size: 1.2em;
      color: var(--td-warning-color);
    }
  }
}
</style>
