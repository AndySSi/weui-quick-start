# Vue 3 + TypeScript + Vite + WeUI

可复制使用的移动 Web 脚手架，配合官方 weui.js，内置路由、深色模式和代码格式化配置。原始需求 note.md 仅保留在本地，不纳入仓库或复制模板。

## 快速开始

要求 Node.js 20.19+ 或 22.12+，推荐 Node.js 22 LTS；pnpm 9.9.0。

```powershell
cd D:\uniapp\weui-simple-pages
pnpm install
pnpm dev
```

打开终端输出的网址；手机和电脑在同一局域网时可访问电脑的局域网 IP 与对应端口。

```powershell
pnpm type-check
pnpm test
pnpm build
pnpm preview
```

构建产物位于 dist，可部署至静态服务器。base 默认使用相对路径，方便子目录部署。

## 复用模板

在本模板目录执行：

```powershell
pnpm create ../my-weui-app
cd ../my-weui-app
pnpm install
pnpm dev
```

目标目录必须不存在。复制时排除 node_modules、dist、Git 历史、本地环境文件和原始需求说明；保留依赖锁文件与版本文档。不自动初始化 Git 或安装依赖。

## 目录与开发约定

- src/App.vue：应用路由出口。
- src/router/routes.ts：页面路径、懒加载与导航元信息。
- src/router/index.ts：Hash 路由初始化、页面标题、滚动恢复与导航后的弹层清理。
- src/layouts/MainLayout.vue：公共顶部栏、返回按钮和 WeUI 底部路由导航。
- src/pages/：首页交互、项目列表/详情、设置、404、独立 Tabbar 示例。
- src/components/TabIcon.vue：项目自定义的内联 SVG 导航图标，不依赖第三方图标库。
- src/services/projects.ts：本地项目示例数据。
- src/main.ts：全局加载官方 WeUI CSS，再加载项目样式。
- uno.config.ts：UnoCSS 原子类、WeUI 主题颜色与公共 shortcuts。
- src/styles.scss：全局基础样式、安全区域与复杂公共样式。
- src/lib/ui.ts：文本转义、常用反馈与带 finally 清理的 loading。
- src/types/weui.d.ts：示例所用 weui.js API 的局部类型定义，非完整官方类型。
- scripts/create.mjs：复制模板。
- docs/weui-guide.md：版本研究与升级流程。
- docs/routing.md：页面组织、路由与 Tabbar 开发指南。
- docs/styling.md：UnoCSS 与 SCSS 样式开发约定。
- scripts/tests/routes.test.mjs：路由解析回归测试。

WeUI 提供 CSS 与 DOM 结构，Vue 管理表单状态，weui.js 提供弹窗和选择器等交互。组件结构请以当前版本官方示例为准，不要只复制旧博客中的 class。对同一个表单或 tab 避免同时使用 Vue 和 weui.js 初始化 DOM 事件，以免重复监听。

weui.js 会在 body 下添加弹层，自定义弹层样式应放在全局 CSS 中；长期存在的弹层在页面卸载时调用 hide()。动态字符串通过 ui 包装层传入，新增 picker/actionSheet 动态标签时同样先 escapeText()，不要直接插入用户 HTML。loading 使用 withLoading()，异步任务成功或失败后都会关闭。

路由采用 Vue Router 5.5.1，不预装状态库、请求库或微信 JS-SDK。当前表单仅演示，无后端；通知开关不会申请系统通知权限。WeUI 外观不等同于微信授权、支付等能力，这些能力需独立接入 JS-SDK 与服务端。本项目面向浏览器，weui.js 依赖 DOM，不适用于微信小程序。

## 页面与导航

默认 Hash 模式，例如 `/#/projects/weui-starter`，静态托管无需配置业务路径回退。页面均按需加载，包含：首页 `/`、项目 `/projects`、详情 `/projects/:id`、设置 `/settings`、WeUI Tabbar 示例 `/examples/tabbar` 和兜底 404。

首页和设置页均可进入 Tabbar 示例。应用底栏用 RouterLink 切换路由；独立示例用 Vue 状态切换消息、通讯录、我三个内容面板，展示图标、选中态、未读徽标和键盘导航。示例页隐藏应用底栏，避免双重导航。

详细开发约定、参数传递、返回与部署说明见 [多页面开发指南](docs/routing.md)。

## 样式方案

日常布局、间距、颜色优先使用 UnoCSS 原子类，重复组合放入 uno.config.ts 的 shortcuts；复杂组件样式使用 `<style scoped lang="scss">`，全局样式放在 src/styles.scss。UnoCSS 主题颜色引用 WeUI CSS 变量，自动适配现有深色模式。不额外引入 reset，保留 WeUI 组件的基础样式。

当前 Tabbar 示例已展示原子类和 scoped SCSS 混合使用。配置、动态类名约定及例子见 [样式开发指南](docs/styling.md)。

VS Code 安装并启用推荐的 UnoCSS 扩展后，匹配的原子类及 shortcuts 下方会显示虚线，悬停可查看 CSS；WeUI 类和普通 SCSS 类不显示该标识。新项目没有提示时，执行 `UnoCSS: Reload UnoCSS` 或 `Developer: Reload Window` 重新加载配置。

## 代码格式

使用项目内固定版本的 Prettier 3.10.1，配置位于 `.prettierrc.json`：2 空格缩进、100 列参考宽度、单引号、不加分号、尾逗号和 LF 换行。Vue 多属性标签每行一个属性，多行开始标签的结束尖括号单独换行，script/style 内容不额外缩进。

Vue 模板采用 `htmlWhitespaceSensitivity: "ignore"`，允许格式化工具整理标签间空白，避免 `>返回首页` 这类排版；需要精确保留空格的行内文本请显式表达空格，或用 `<!-- prettier-ignore -->` 保留局部格式。

```powershell
pnpm format        # 格式化项目
pnpm format:check  # 检查格式，可用于 CI
```

VS Code 安装推荐的 Prettier 和 Vue 扩展后，本项目自动使用 Prettier 保存格式化。`.editorconfig` 同步缩进与换行规则。构建产物、依赖、锁文件、本地环境文件及原始需求 note.md 不参与格式化。复制脚手架时会一并保留格式配置与编辑器设置。

提交前建议依次执行 `pnpm format:check`、`pnpm test`、`pnpm build`。目前测试覆盖详情链接参数、列表筛选 URL、独立 Tabbar 路由和 404 匹配；不涵盖浏览器点击、视觉效果或微信真机兼容性，这些仍需手动验收。

## 深色模式

页面顶部「外观」支持跟随系统、浅色、深色，默认跟随系统。偏好保存在 localStorage（weui-theme），刷新后恢复；系统主题变化和同源标签页设置变化会同步。存储不可用时切换仍在当前页面生效。

`src/lib/theme.ts` 通过官方 `body[data-weui-theme]` 控制 WeUI 与 body 下的 weui.js 弹层，并同步原生控件 color-scheme 和浏览器 theme-color。自定义颜色应使用 `var(--weui-BG-0)`、`var(--weui-FG-0)` 等变量，在 body 及其后代使用（官方变量不定义在 html 上）。业务中可调用 `setTheme('dark' | 'light' | 'system')`。

## 依赖与升级

WeUI、weui.js、Vue、Vite 等采用创建时 npm latest 稳定版；TypeScript 使用 vue-tsc 支持的最新 6.0.3（其当前依赖要求 <7，最新 7.0.2 实测无法运行类型检查）。所有版本固定，pnpm-lock.yaml 保证安装可复现。更新前阅读 [版本与用法指南](docs/weui-guide.md)。

官方入口：[WeUI](https://github.com/Tencent/weui)、[Wiki](https://github.com/Tencent/weui/wiki)、[weui.js](https://github.com/Tencent/weui.js)、[API 文档](https://github.com/Tencent/weui.js/blob/master/docs/README.md)、[weui.js Wiki](https://github.com/Tencent/weui.js/wiki)。
