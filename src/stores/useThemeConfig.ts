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

interface SearchCssVariables {
  searchButtonBgColor: string
  searchButtonColor: string
  searchButtonHeight: number
  searchButtonFontSize: number
  searchButtonBorderRadius: number
  searchButtonBorderColor: string

  searchButtonHoverBgColor: string
  searchButtonHoverColor: string
  searchButtonHoverBorderColor: string

  searchResultItemBgColor: string
  searchResultItemHoverBgColor: string
  searchResultItemColor: string
  searchResultItemHoverColor: string

  searchResultItemBorderColor: string
  searchResultItemHoverBorderColor: string

  searchResultItemBorderRadius: number
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
  linkMaxWidth: number | string
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

export type ThemeConfig = BaseCssVariables & AsideCssVariables & HeaderCssVariables & SearchCssVariables & LinkCssVariables & SiteConfig

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

export const searchCssVariables: SearchCssVariables = {
  searchButtonBgColor: '#f6f6f7',
  searchButtonHoverBgColor: '#f6f6f7',

  searchButtonColor: 'rgba(60, 60, 67, .78)',
  searchButtonHoverColor: 'rgba(60, 60, 67, .78)',

  searchButtonHeight: 30,
  searchButtonFontSize: 14,
  searchButtonBorderRadius: 5,

  searchButtonBorderColor: 'transparent',
  searchButtonHoverBorderColor: '#0052d9',

  searchResultItemBgColor: '#fff',
  searchResultItemHoverBgColor: '#fff',

  searchResultItemColor: '#333',
  searchResultItemHoverColor: '#333',

  searchResultItemBorderColor: '#f2f2f2',
  searchResultItemHoverBorderColor: '#0052d9',

  searchResultItemBorderRadius: 5,
}

export const linkCssVariables: LinkCssVariables = {
  linkColor: '#555',
  linkIconColor: '#0052d9',
  linkBgColor: '#fff',
  linkMinWidth: 0,
  linkMaxWidth: '100%',
  linkHeight: 32,
  linkRadius: 4,
  linkBorderColor: '#ccc',
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
    ...searchCssVariables,
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
