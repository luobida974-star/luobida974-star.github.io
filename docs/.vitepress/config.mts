import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '洛必达',
  description: '控制工程研究生的个人主页与学习笔记',
  lang: 'zh-CN',
  lastUpdated: true,
  base: '/',

  sitemap: { hostname: 'https://luobida974-star.github.io' },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/about' },
      { text: '笔记', link: '/guide/getting-started' },
    ],
        sidebar: [
      { text: '开始', items: [{ text: '快速上手', link: '/guide/getting-started' }] },
            { text: '研究', items: [
        { text: '叶轮动平衡视觉检测方法研究', link: '/research-content' },
        { text: '课题算法概念', link: '/research-algorithms' },
      ] },
      { text: '笔记', items: [{ text: '学习笔记', link: '/notes/' }] },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/luobida974-star' }],
    editLink: {
      pattern: 'https://github.com/luobida974-star/luobida974-star.github.io/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    search: { provider: 'local' },
    footer: { message: 'Built with VitePress', copyright: 'Copyright © 2026' },
  },
})