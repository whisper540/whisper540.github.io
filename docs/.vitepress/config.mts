import { defineConfig } from 'vitepress'

// 导入主题的配置
import { blogTheme } from './blog-theme'

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// 如果项目名已经为 name.github.io 域名，则不需要修改！
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/vitepress-blog-sugar-template/'
//   : '/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  // base,
  lang: 'zh-cn',
  title: '暖暖的石头',
  description: '记录暖暖和石头的生活点滴',
  // lastUpdated: true,
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    // 展示 2,3 级标题在目录中
    outline: {
      level: [2, 3],
      label: '目录'
    },
    // 默认文案修改
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    // lastUpdatedText: '上次更新于',
    lastUpdated: {
      text: '上次更新于'
    },

    // 设置logo
    logo: '/logo.png',
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    nav: [
        { text: '首页', link: '/' },
        { text: '生活',
            items: [
                { text: '日常',
                    items: [
                        { text: '配产假最后一天', link: '/life/daily/2025-10-30(配产假最后一天)' },
                    ]
                },
            ]
        },
        { text: '育娃',
            items: [
                { text: '1岁',
                    items: [
                        { text: '育儿心经', link: '/year1/parenting-experience' },
                    ]
                },
                { text: '...', link: '/year...' }
            ]
        },
        // { text: '菜谱', link: '/menu' },
        // { text: '技术', link: '/technique' },
        { text: '关于作者', link: 'https://blog.anliu.online/about.html' }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/whisper540'
      }
    ]
  }
})
