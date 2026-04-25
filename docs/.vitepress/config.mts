// import {defineConfig} from 'vitepress'
// @ts-ignore
import {withMermaid} from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid({
  base: '/notes/',
  title: 'notes',
  description: '后端仔的学习笔记',
  vite: {},
  lastUpdated: true,
  markdown: {
    lineNumbers: true
  },
  head: [
    // Algolia 域名验证 Meta 标签（直接复制你截图里的内容）
    ['meta', { name: 'algolia-site-verification', content: 'CF8FC57655ED0008' }]
  ],
  mermaid: {
    // 配置参考： https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults
  },
  mermaidPlugin: {
    class: 'mermaid my-class'
  },
  themeConfig: {
    lastUpdated: {
      text: '最后更新于',
      formatTimestamp: (timestamp) => {
        return new Date(timestamp).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: '主页', link: '/'},
      {
        text: '游戏开发',
        items: [
          {
            text: 'Cocos',
            link: '/game/cocos/index'
          },
          {
            text: 'Unity',
            link: '/game/unity/index'
          },
          {
            text: 'Unreal',
            link: '/game/unreal/index'
          }
        ]
      },
      {
        text: '编程语言',
        items: [
          {
            text: '汇总',
            link: '/language/index'
          },
          {
            text: 'Php',
            link: '/language/php/index'
          },
          {
            text: 'Python',
            link: '/language/python/index'
          },
          {
            text: 'golang',
            link: '/language/golang/index'
          },
          {
            text: 'Java',
            link: '/language/java/index'
          },
          {
            text: 'Vue',
            link: '/language/vue/vue3/index'
          },
          {
            text: 'HarmonyOS',
            link: '/language/harmonyOS/arkTs'
          },
          {
            text: 'C#',
            link: '/language/cs/index'
          }
        ]
      },
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
          },
          {
            text: 'IO',
            link: '/backend/io/index'
          },
          {
            text: '工具类',
            link: '/backend/utils/index'
          }
        ]
      },
      {
        text: '服务器',
        items: [
          {
            text: 'Docker教程',
            link: '/server/docker'
          },
          {
            text: 'Docker',
            link: '/server/dockerInit'
          },
          {
            text: 'CentOs',
            link: '/server/centosInit'
          },
          {
            text: 'K8s',
            link: '/server/k8s'
          },
          {
            text: 'jenkins',
            link: '/server/jenkins'
          },
          {
            text: 'Gitlab安装',
            link: '/server/gitlab'
          }
        ]
      },
      {
        text: '数据库',
        items: [
          {
            text: 'ElasticSearch',
            link: '/database/elasticSearch'
          },
          {
            text: 'MongoDB',
            link: '/database/mongodb'
          }
        ]
      },
      {
        text: '前端',
        items: [
          {
            text: '动态表格',
            link: '/frontend/utils/dynamicTable'
          },
          {
            text: '跨域配置',
            link: '/frontend/utils/corsConfig'
          },
          {
            text: 'MockJs',
            link: '/frontend/utils/mockjs'
          },
          {
            text: 'Css常见问题',
            link: '/frontend/utils/cssQa'
          },
          {
            text: 'Electron仿QQ音乐',
            link: '/frontend/electron/index'
          },
          {
            text: 'Echarts',
            link: '/frontend/echarts/index'
          }
        ]
      }
    ],
    sidebar: {
      // 游戏开发
      '/game/': [
        {
          text: '游戏开发',
          collapsed: false,
          items: [
            {text: 'Cocos', link: '/game/cocos/index'},
            {text: 'Unity', link: '/game/unity/index'},
            {text: 'Unreal', link: '/game/unreal/index'},
          ]
        }
      ],

      // 编程语言
      '/language/': [
        {
          text: '编程语言',
          collapsed: false,
          items: [
            {text: '汇总', link: '/language/index'},
            {
              text: 'Php',
              link: '/language/php/index',
              collapsed: true,
              items: [
                {
                  text: 'Php8新特性',
                  link: '/language/php/php8'
                },
                {
                  text: 'ThinkPhp6',
                  link: '/language/php/thinkphp6'
                }
              ]

            },
            {text: 'Python', link: '/language/python/index'},
            {text: 'Golang', link: '/language/golang/index'},
            {
              text: 'Java',
              link: '/language/java/index',
              collapsed: true,
              items: [
                {
                  text: 'Java9新特性',
                  link: '/language/java/java9'
                },
                {
                  text: 'Java10新特性',
                  link: '/language/java/java10'
                },
                {
                  text: 'Java11新特性',
                  link: '/language/java/java11'
                },
                {
                  text: 'Java17新特性',
                  link: '/language/java/java17'
                },
                {
                  text: 'Java21新特性',
                  link: '/language/java/java21'
                }
              ]
            },
            {
              text: 'Vue',
              link: '/language/vue/vue3/index',
              collapsed: true,
              items: [
                {
                  text: 'Vue3',
                  link: '/language/vue/vue3/index',
                  items: [
                    {
                      text: '基础语法',
                      link: '/language/vue/vue3/index'
                    },
                    {
                      text: 'Pinia',
                      link: '/language/vue/vue3/pinia'
                    }
                  ]
                },
                {
                  text: 'Vue2',
                  link: '/language/vue//vue2/index',
                  items: [
                    {
                      text: '基础语法',
                      link: '/language/vue/vue2/index'
                    },
                    {
                      text: 'Vuex',
                      link: '/language/vue/vue2/vuex'
                    },
                    {
                      text: 'Vant购物车',
                      link: '/language/vue/vue2/vant'
                    }
                  ]
                }
              ]
            },
            {
              text: 'HarmonyOS',
              link: '/language/harmonyOS/arkTs',
              collapsed: true,
              items: [
                {
                  text: 'ArkTs',
                  link: '/language/harmonyOS/arkTs'
                },
                {
                  text: 'ArkUI',
                  link: '/language/harmonyOS/arkUI'
                }
              ]
            },
            {text: 'C#', link: '/language/cs/index'},
          ]
        }
      ],

      // 后端
      '/backend/': [
        {
          text: '后端技术',
          collapsed: false,
          items: [
            {text: '消息中间件', link: '/backend/mq/index'},
            {text: '审批流 Flowable', link: '/backend/flowable/flowable'},
            {text: 'Nginx', link: '/backend/nginx/nginx子请求鉴权'},
            {
              text: 'IO',
              link: '/backend/io/index',
              collapsed: false,
              items: [{
                text: 'NIO',
                link: '/backend/io/nio'
              },
                {
                  text: 'netty',
                  link: '/backend/io/netty'
                }]
            },
            {text: '工具类', link: '/backend/utils/index'},
            {
              text: 'Cloud', collapsed: true, items: [
                {text: 'Sentinel', link: '/backend/cloud/sentinel'},
                {text: 'Seata', link: '/backend/cloud/seata'},
              ]
            }
          ]
        }
      ],

      // 服务器
      '/server/': [
        {
          text: '服务器运维',
          collapsed: false,
          items: [
            {text: 'Docker教程', link: '/server/docker'},
            {text: 'Docker 初始化', link: '/server/dockerInit'},
            {text: 'CentOS 初始化', link: '/server/centosInit'},
            {text: 'K8s', link: '/server/k8s'},
            {text: 'Jenkins', link: '/server/jenkins'},
            {text: 'GitLab 安装', link: '/server/gitlab'},
          ]
        }
      ],

      // 数据库
      '/database/': [
        {
          text: '数据库',
          collapsed: false,
          items: [
            {text: 'ElasticSearch', link: '/database/elasticSearch'},
            {text: 'MongoDB', link: '/database/mongodb'},
          ]
        }
      ],
      '/error' :[
        {
          text: '错误处理',
          collapsed: false,
          items: [
            {text: '错误处理', link: '/error/index'},
          ]
        }
      ],
      // 前端
      '/frontend/': [
        {
          text: '前端开发',
          collapsed: false,
          items: [
            {text: '动态表格', link: '/frontend/utils/dynamicTable'},
            {text: '跨域配置', link: '/frontend/utils/corsConfig'},
            {text: 'MockJs', link: '/frontend/utils/mockjs'},
            {text: 'CSS 常见问题', link: '/frontend/utils/cssQa'},
            {text: 'Electron 仿QQ音乐', link: '/frontend/electron/index'},
            {text: 'Echarts', link: '/frontend/echarts/index'},
            {text: 'VitePress', link: '/frontend/vitepress/vitepress'},
            {text: '工具类', link: '/frontend/utils/index'},
          ]
        }
      ],

      // 根目录 / （首页）不显示侧边栏
      '/': []
    },

    socialLinks: [
      {icon: 'github', link: 'https://github.com/chargeduck/notes'}
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
      provider: 'algolia',
      options: {
        appId: '0HXPSG76HI',
        apiKey: 'cb3075b947232c05052a0ae4eabda6a3',
        indexName: 'notesCrawler',
        locales: {
          root: {
            placeholder: '搜索文档',
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                searchBox: {
                  resetButtonTitle: '清除',
                  cancelButtonText: '取消'
                },
                startScreen: {
                  recentSearchesTitle: '搜索历史',
                  noRecentSearchesText: '暂无搜索记录'
                },
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  }
})
