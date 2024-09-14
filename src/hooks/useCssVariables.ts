import { useCssVar } from '@vueuse/core';
import { watch } from 'vue';
import { kebabCase } from 'lodash-es'
import useThemeConfig, { ThemeConfig } from '@/stores/useThemeConfig'
import { NAMESPACE } from '@/constants'

const root = document.documentElement

export function setLayoutCssVars() {
  const themeConfigStore = useThemeConfig();

  return {
    setLayout() {
      sv('bgColor', root)
      sv('textColor', root);
      sv('fontFamily', root);
      sv('fontSize', root);
      sv('borderColor', root);

      sv('asideWidth', root, (val) => `${val}px`)
      sv('asideBgColor', root);
      sv('asideTextColor', root);
      sv('asideItemColor', root)
      sv('asideItemMinHeight', root, (val) => `${val}px`)
      sv('asideActiveItemColor', root);

      sv('headerHeight', root, (val) => `${val}px`)
      sv('headerBgColor', root);
      sv('headerTextColor', root);
      sv('headerTitleFontSize', root, (val) => `${val}px`)

      return root
    },
  }

  function sv(key: keyof ThemeConfig, el: any, handler?: (val: any) => string) {
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