export function useGoogleAnalytics(id) {
    if (process.env.NODE_ENV === 'production' && id && typeof window !== 'undefined') {
        if (window.dataLayer && window.gtag) {
            return
        }

        const script = document.createElement('script')
        script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
        script.async = true
        document.head.appendChild(script)

        window.dataLayer = window.dataLayer || []
        window.gtag = function() {
            dataLayer.push(arguments)
        }

        window.gtag('js', new Date())

        window.gtag('config', id, {
            cookie_flags: 'SameSite=None;Secure',
            cookie_domain: 'auto'
        })

        console.log('Google Analytics Initialized.')
    }
}