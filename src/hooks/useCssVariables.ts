import { useCssVar } from '@vueuse/core';
import { watch } from 'vue';
import { kebabCase } from 'lodash-es'
import useThemeConfig, { type ThemeConfig, baseCssVariables, asideCssVariables, headerCssVariables, searchCssVariables, linkCssVariables } from '@/stores/useThemeConfig'
import { NAMESPACE } from '@/constants'

const root = document.documentElement

export function setLayoutCssVars() {
  const themeConfigStore = useThemeConfig();

  return {
    setLayout() {
      svGroup(baseCssVariables)
      svGroup(linkCssVariables)
      svGroup(headerCssVariables)
      svGroup(searchCssVariables)
      svGroup(asideCssVariables)
      return root
    },
  }

  function svGroup(data: Record<string, any>, el: any = root) {
    Object.keys(data).forEach((key) => {
      sv(key as any, el, (val) => {
        if (typeof val === 'number') return `${val}px`
        return val
      })
    })
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