import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/notes/',
  title: "notes",
  description: "后端仔的学习笔记",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      {
        text: '后端',
        items: [
          {
            text: '消息中间件',
            link: '/backend/mq/index'
          },
          {
            text: '审批流',
            link: '/backend/flowable/flowable'
          }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          {
            text: 'Vitepress部署GithubPage',
            link: '/frontend/vitepress/vitepress'
          }
        ]
      },
      {
        text: '消息中间件',
        items: [
          {
            text: 'ActiveMq尚硅谷版',
            link: '/backend/mq/activemq_antguigu'
          }
        ]
      },
      {
        text: '审批流',
        items: [
          {
            text: 'Flowable审批流',
            link: '/backend/flowable/flowable'
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    }
  }
})
