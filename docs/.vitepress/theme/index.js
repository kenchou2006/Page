import DefaultTheme from 'vitepress/theme'
import './styles/size.css'
import './styles/logo.css'
import './styles/style.css'
import { useGoogleAnalytics } from './googleAnalytics'
import { useCloudflareAnalytics } from './cloudflareAnalytics'

export default {
    extends: DefaultTheme,
    enhanceApp({ app, router, siteData }) {
        if (typeof window !== 'undefined') {
            const themeConfig = siteData.value.themeConfig
            if (themeConfig && themeConfig.googleAnalyticsId) {
                useGoogleAnalytics(themeConfig.googleAnalyticsId)
            } else {
                console.warn('Google Analytics ID Initial Failed.')
                console.log('themeConfig:', themeConfig)
            }

            if (themeConfig && themeConfig.cloudflareAnalyticsToken) {
                useCloudflareAnalytics(themeConfig.cloudflareAnalyticsToken)
            } else {
                console.warn('Cloudflare Analytics token not provided.')
            }
        }
    }
}