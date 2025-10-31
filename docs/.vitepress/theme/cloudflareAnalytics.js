export function useCloudflareAnalytics(token) {
    if (process.env.NODE_ENV === 'production' && token && typeof window !== 'undefined') {
        const src = 'https://static.cloudflareinsights.com/beacon.min.js'
        const exists = !!document.querySelector(`script[src*="${src}"]`)
        if (exists) return

        const script = document.createElement('script')
        script.defer = true
        script.src = src
        script.setAttribute('data-cf-beacon', JSON.stringify({ token }))
        document.head.appendChild(script)

        console.log('Cloudflare Web Analytics Initialized.')
    }
}

