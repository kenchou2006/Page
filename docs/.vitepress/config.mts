import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "KenChou's Site",
  description: "A VitePress Site",
  appearance: true,
  lang: 'zh-Hant',
  cleanUrls: 'with-subfolders',
  // ignoreDeadLinks: true,
  themeConfig: {
    logo: 'https://avatars.githubusercontent.com/u/65105273?size=64',
    googleAnalyticsId: 'G-N37FM9L8RQ',
    maxWidth: 4000,
    nav: [
      { text: 'Rickroll', link: '/Pages/Rickroll' },
      { text: 'Gravatar', link:'https://gravatar.com/kenchou2006'},
      { text: 'Links' , link:'/Pages/Links'},
      { text: 'About', link: '/Pages/About' },
    ],
    footer: {
        message: "Released under the MIT License",
        copyright: "Copyright © 2025-present Chou Kung Huan",
      },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kenchou2006' },
      { icon: 'instagram', link: 'https://instagram.com/kenchou2006' },
      { icon: 'mastodon', link: 'https://mastodon.social/@kenchou2006' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/kenchou2006/' },
      {
          icon: {
              svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" fill="none"/><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>'
          },
          link: 'mailto:giungfon@zhiu.dev'
        },
    ]
  },
  rewrites: {
      'Pages/index.md': 'index.md',
  },
  head: [
    ['link', { rel: 'icon', href: 'https://github.githubassets.com/favicons/favicon.svg', media: '(prefers-color-scheme: light)'  }],
    ['link', { rel: 'icon', href: 'https://github.githubassets.com/favicons/favicon-dark.svg', media: '(prefers-color-scheme: dark)' }],
  ]
})
