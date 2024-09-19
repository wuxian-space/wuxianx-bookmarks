import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface BaseCssVariables {
  bgColor: string
  textColor: string
  fontFamily: string
  fontSize: number
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

interface LinkCssVariables {
  linkColor: string
  linkHoverIconColor: string
  linkIconColor: string
  linkHoverColor: string
  linkBgColor: string | [string, string]
  linkHoverBgColor: string | [string, string]
  linkMinWidth: number
  linkMaxWidth: number
  linkHeight: number
  linkRadius: number
  linkBorderColor: string
  linkBorderStyle: 'solid' | 'dashed' | 'dotted'
  linkBorderWidth: number
  linkAlign: 'center' | 'left' | 'right'
  linkPaddingLeft: number,
  linkPaddingRight: number,
  linkHoverBorderColor: string | [string, string]
}

export type ThemeConfig = BaseCssVariables & AsideCssVariables & HeaderCssVariables & LinkCssVariables & SiteConfig

export const baseCssVariables: BaseCssVariables = {
  bgColor: '#f2f2f2',
  textColor: '#333',
  fontFamily: 'BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontSize: 14,
  borderColor: '#eee',
}
export const asideCssVariables: AsideCssVariables = {
  asideWidth: 240,
  asideBgColor: '#ffff',
  asideTextColor: '#999',
  asideItemColor: '#333',
  asideActiveItemColor: '#0052d9',
  asideItemMinHeight: 36,
}
export const headerCssVariables: HeaderCssVariables = {
  headerHeight: 48,
  headerBgColor: '#fff',
  headerTextColor: '#333',
  headerTitleFontSize: 18,
}
export const linkCssVariables: LinkCssVariables = {
  linkColor: '#555',
  linkIconColor: '#0052d9',
  linkBgColor: '#fff',
  linkMinWidth: 80,
  linkMaxWidth: 240,
  linkHeight: 32,
  linkRadius: 4,
  linkBorderColor: '#eee',
  linkBorderStyle: 'solid',
  linkBorderWidth: 1,
  linkAlign: 'left',
  linkPaddingLeft: 10,
  linkPaddingRight: 10,

  linkHoverColor: '#0052d9',
  linkHoverIconColor: 'red',
  linkHoverBgColor: '#0052d913',
  linkHoverBorderColor: '#0052d9',
}


export default defineStore('theme-config', () => {
  const config = ref<ThemeConfig>({
    ...baseCssVariables,
    ...asideCssVariables,
    ...headerCssVariables,
    ...linkCssVariables,

    title: '无限书签',
    logo: '/logo.png',
  })

  return {
    config,
    title: computed(() => config.value.title),
    logo: computed(() => config.value.logo),
  }
})
