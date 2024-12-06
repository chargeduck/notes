// import {defineConfig} from 'vitepress'
import {withMermaid} from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid({
    base: '/notes/',
    title: "notes",
    description: "后端仔的学习笔记",
    markdown: {
        lineNumbers: true,
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
            {text: 'Home', link: '/'},
            {text: 'Examples', link: '/markdown-examples'},
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
                    }
                ]
            }
        ],

        sidebar: [
            {
                text: 'Examples',
                collapsed: true,
                items: [
                    {text: 'Markdown Examples', link: '/markdown-examples'},
                    {text: 'Runtime API Examples', link: '/api-examples'}
                ]
            },
            {
                text: '消息中间件',
                items: [
                    {
                        text: 'ActiveMq尚硅谷版',
                        link: '/backend/mq/activemq_antguigu'
                    },
                    {
                        text: 'RocketMq',
                        items: [
                            {
                                text: '尚硅谷版',
                                link: '/backend/mq/rocketmq/rocketmq_antguigu'
                            },
                            {
                                text: '黑马版',
                                link: '/backend/mq/rocketmq/rocketmq_itcast'
                            },
                            {
                                text: '自己整理',
                                link: '/backend/mq/rocketmq/rocketmq'
                            }
                        ]
                    },
                    {
                        text: 'Kafka',
                        items: [
                            {
                                text: 'Kafka简介',
                                link: '/backend/mq/kafka/index'
                            },
                            {
                                text: 'Centos安装Kafka集群(Kraft)',
                                link: '/backend/mq/kafka/centos_cluster'
                            }
                        ]
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
            },
            {
                text: '工具类',
                collapsed: true,
                items: [
                    {
                        text: 'Vitepress部署GithubPage',
                        link: '/frontend/vitepress/vitepress'
                    },
                    {
                        text: 'EasyExcel导出工具类，动态合并表头',
                        link: '/backend/utils/dynamicMergeHeader'
                    },
                    {
                        text: '导出Word工具类',
                        link: '/backend/utils/exportWord'
                    },
                    {
                        text: '自定义权限注解',
                        link: '/backend/utils/permissionControl'
                    },
                    {
                        text: 'Dynamic多数据源',
                        link: '/backend/utils/dynamicDatasource'
                    },
                    {
                        text: 'Cors跨域配置',
                        link: '/backend/utils/corsConfig'
                    }
                ]
            },
            {
                text: '数据库',
                collapsable: true,
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
                        text: '动态表格',
                        link: '/frontend/utils/dynamicTable'
                    }
                ]
            }
        ],

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
