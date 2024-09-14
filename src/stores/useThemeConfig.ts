import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface BaseCssVariables {
  bgColor: string
  textColor: string
  fontFamily: string
  fontSize: string
  borderColor: string
}

interface AsideCssVariables {
  asideWidth: number,
  asideBgColor: string | [string, string]
  asideTextColor: string
  asideItemMinHeight: number
  asideItemColor: string
  asideActiveItemColor: string
}

interface HeaderCssVariables {
  headerHeight: number,
  headerBgColor: string | [string, string]
  headerTextColor: string
  headerTitleFontSize: number
}

interface SiteConfig {
  title: string
  logo: string
}

export type ThemeConfig = BaseCssVariables & AsideCssVariables & HeaderCssVariables & SiteConfig

export default defineStore('theme-config', () => {
  const config = ref<ThemeConfig>({
    bgColor: '#f2f2f2',
    textColor: '#333',
    fontFamily: 'BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontSize: '14px',
    borderColor: '#eee',

    asideWidth: 240,
    asideBgColor: '#ffff',
    asideTextColor: '#999',
    asideItemColor: '#333',
    asideActiveItemColor: '#0052d9',
    asideItemMinHeight: 36,

    headerHeight: 48,
    headerBgColor: '#fff',
    headerTextColor: '#333',
    headerTitleFontSize: 18,

    title: '无限书签',
    logo: '/logo.png',
  })

  return {
    config,
    title: computed(() => config.value.title),
    logo: computed(() => config.value.logo),
  }
})
