<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';
import UpdateGithubFile from '@/components/update-github-file.vue';
import useSettings from '@/stores/useSettings';

const visible = defineModel<boolean>('visible', { default: false });

const settingsStore = useSettings();
const { updateSettings } = settingsStore;
const { userSettings, githubError } = storeToRefs(settingsStore);

const formRef = useTemplateRef('formRef');
</script>

<template>
  <t-dialog v-model:visible="visible" header="同步设置" mode="modeless" width="700px" draggable>
    <template #body>
      <t-form ref="formRef">
        <t-form-item label="忽略">
          <t-textarea v-model="userSettings.ignores" name="description" autosize readonly />
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
        </t-form-item>

        <t-form-item>
          <UpdateGithubFile :content="[{ name: 'abc' }, { name: 'def' }]" :disabled="!!githubError" block />
        </t-form-item>
      </t-form>
    </template>

    <template #confirmBtn></template>

    <template #cancelBtn></template>
  </t-dialog>
</template>
