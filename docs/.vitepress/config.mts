import { defineConfig } from 'vitepress'
import {generateSidebar, } from "./autoSidebar";
import {autoGetSidebarOptionBySrcDir } from "./sidebar"

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
          },
          {
            text: 'Nginx',
            link: '/backend/nginx/nginx子请求鉴权'
          }
        ]
      },
      {
        text: '服务器',
        items: [
          {
            text: 'Docker',
            link: '/server/dockerInit'
          }
        ]
      }
    ],
    // sidebar: generateSidebar('docs/',[]),
    sidebar: autoGetSidebarOptionBySrcDir('docs/', ''),
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     collapsed: true,
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   },
    //   {
    //     text: '消息中间件',
    //     items: [
    //       {
    //         text: 'ActiveMq尚硅谷版',
    //         link: '/backend/mq/activemq_antguigu'
    //       },
    //       {
    //         text: 'RocketMq',
    //         items: [
    //           {
    //             text: '尚硅谷版',
    //             link: '/backend/mq/rocketmq_antguigu'
    //           },
    //           {
    //             text: '黑马版',
    //             link: '/backend/mq/rocketmq_itcast'
    //           },
    //           {
    //             text: '自己整理',
    //             link: '/backend/mq/rocketmq'
    //           }
    //         ]
    //       }
    //
    //     ]
    //   },
    //   {
    //     text: '审批流',
    //     items: [
    //       {
    //         text: 'Flowable审批流',
    //         link: '/backend/flowable/flowable'
    //       }
    //     ]
    //   },
    //   {
    //     text: '工具类',
    //     collapsed: true,
    //     items: [
    //       {
    //         text: 'Vitepress部署GithubPage',
    //         link: '/frontend/vitepress/vitepress'
    //       },
    //       {
    //         text: 'EasyExcel导出工具类，动态合并表头',
    //         link: '/backend/utils/DynamicMergeHeader'
    //       },
    //       {
    //         text: '导出Word工具类',
    //         link: '/backend/utils/exportWord'
    //       },
    //       {
    //         text: '自定义权限注解',
    //         link: '/backend/utils/permissionControl'
    //       }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/chargeduck/notes' }
    ],
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    outline: {
      label: '目录',
      level: [1, 2]
    },
    search: {
      provider: 'local',
      // options: {
      //   appId: 'WREY2TJAEX',
      //   apiKey: 'f9da2db9a163ef90f59b268823c3cb9f',
      //   indexName: 'chargeDuck',
      //   placeholder: '请输入关键词',
      //   translations: {
      //     button: {
      //       buttonText: '搜索',
      //       buttonAriaLabel: '搜索'
      //     },
      //     modal: {
      //       searchBox: {
      //         resetButtonTitle: '清除查询条件',
      //         resetButtonAriaLabel: '清除查询条件',
      //         cancelButtonText: '取消',
      //         cancelButtonAriaLabel: '取消'
      //       }
      //     }
      //   }
      // }
    }
  }
})
