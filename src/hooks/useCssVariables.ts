import { useCssVar } from '@vueuse/core';
import { useTemplateRef, watch } from 'vue';
import { kebabCase } from 'lodash-es'
import useThemeConfig, { ThemeConfig } from '@/stores/useThemeConfig'
import { NAMESPACE } from '@/constants'

export function setLayoutCssVars() {
  const themeConfigStore = useThemeConfig();

  return {
    setLayout() {
      const layoutEl = useTemplateRef<HTMLElement>('default-theme-layout');

      createWatcher('asideWidth', layoutEl, (val) => `${val}px`)

      return layoutEl
    },

    setAside() {
      const asideEl = useTemplateRef<HTMLElement>('default-theme-aside');

      createWatcher('asideBgColor', asideEl);
      createWatcher('asideTextColor', asideEl);

      return asideEl
    }
  }

  function createWatcher(key: keyof ThemeConfig, el: any, handler?: (val: any) => string) {
    const varKey = `--${NAMESPACE}-${kebabCase(key)}`

    const result = useCssVar(varKey, el);

    watch(
      () => themeConfigStore.config[key],
      (val) => {
        setTimeout(() => {
          if (typeof handler === 'function') {
            result.value = handler(val);
          } else {
            result.value = val.toString();
          }
        }, 0);
      },
      {
        immediate: true
      }
    );

    return result
  }
}