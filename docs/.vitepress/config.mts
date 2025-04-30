// import {defineConfig} from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid({
    base: '/notes/',
    title: 'notes',
    description: '后端仔的学习笔记',
    vite: {},
    markdown: {
        lineNumbers: true
    },

    mermaid: {
        // 配置参考： https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults
    },
    mermaidPlugin: {
        class: 'mermaid my-class'
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '主页', link: '/' },
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
                        text: 'Electron仿QQ音乐',
                        link: '/frontend/electron/index'
                    }
                ]
            }
        ],

        sidebar: [
            {
                text: 'Examples',
                collapsed: true,
                items: [
                    { text: 'Markdown Examples', link: '/markdown-examples' },
                    { text: 'Runtime API Examples', link: '/api-examples' }
                ]
            },
            {
                text: '审批流',
                collapsed: true,
                items: [
                    {
                        text: 'Flowable审批流',
                        link: '/backend/flowable/flowable'
                    }
                ]
            },
            {
                text: '数据库',
                collapsed: true,
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
                collapsed: true,
                items: [
                    {
                        text: '工具类',
                        collapsed: true,
                        items: [
                            {
                                text: '暗色模式',
                                link: '/frontend/utils/darkTheme'
                            }
                        ]
                    },
                    {
                        text: '动态表格',
                        link: '/frontend/utils/dynamicTable'
                    }
                ]
            },
            {
                text: '编程语言',
                collapsed: true,
                link: '/language/index',
                items: [
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
                    {
                        text: 'Python',
                        link: '/language/python/index'
                    },
                    {
                        text: 'Golang',
                        link: '/language/golang/index'
                    },
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
                    {
                        text: 'Vue',
                        collapsed: true,
                        link: '/language/vue/vue3/index',
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
                        text: 'C#',
                        link: '/language/cs/index'
                    }
                ]
            },
            {
                text: '游戏开发',
                collapsed: true,
                items: [
                    {
                        text: 'Cocos',
                        collapsed: true,
                        items: [{
                            text: '简介',
                            link: '/game/cocos/index'
                        }]
                    },
                    {
                        text: 'Unity',
                        collapsed: true,
                        items: [
                            {
                                text: '简介',
                                link: '/game/unity/index'
                            }
                        ]
                    },

                    {
                        text: 'Unreal',
                        collapsed: true,
                        items: [
                            {
                                text: '简介',
                                link: '/game/unreal/index'
                            }
                        ]
                    }
                ]
            },
            {
                text: 'cloud',
                collapsed: true,
                items: [
                    {
                        text: 'Sentinel',
                        link: '/backend/cloud/sentinel'
                    },
                    {
                        text: 'Seata',
                        link: '/backend/cloud/seata'
                    }
                ]
            }
        ],

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
            provider: 'local'
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
