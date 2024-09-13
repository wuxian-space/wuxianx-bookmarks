import { defineStore } from 'pinia';
import { ref } from 'vue';

const DEFAULT_ASIDE_WIDTH = 240

export interface ThemeConfig {
  asideWidth: number,
  asideBgColor: string | [string, string]
  asideTextColor: string
}

export default defineStore('theme-config', () => {
  const config = ref<ThemeConfig>({
    asideWidth: DEFAULT_ASIDE_WIDTH,
    asideBgColor: '#333',
    asideTextColor: '#fff'
  })

  return {
    config,
  }
})
