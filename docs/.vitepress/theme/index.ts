// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/size.css'
import './styles/logo.css'
import './styles/style.css'
// @ts-ignore - reuse existing GA util from JS file
import { useGoogleAnalytics } from './googleAnalytics'
import RickrollPlayer from '../../components/RickrollPlayer.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, siteData }) {
    app.component('RickrollPlayer', RickrollPlayer)
    if (typeof window !== 'undefined') {
      const themeConfig = (siteData as any).value.themeConfig
      if (themeConfig && themeConfig.googleAnalyticsId) {
        useGoogleAnalytics(themeConfig.googleAnalyticsId)
      }
    }
  }
} satisfies Theme
