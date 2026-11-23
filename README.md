# Vue 3 + TypeScript + Vite + WeUI

可复制使用的移动 Web 脚手架，配合官方 weui.js。保留原有 note.md。

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

- src/App.vue：可直接修改的表单和交互示例。
- src/main.ts：全局加载官方 WeUI CSS，再加载项目样式。
- src/lib/ui.ts：文本转义、常用反馈与带 finally 清理的 loading。
- src/types/weui.d.ts：示例所用 weui.js API 的局部类型定义，非完整官方类型。
- scripts/create.mjs：复制模板。
- docs/weui-guide.md：版本研究与升级流程。

WeUI 提供 CSS 与 DOM 结构，Vue 管理表单状态，weui.js 提供弹窗和选择器等交互。组件结构请以当前版本官方示例为准，不要只复制旧博客中的 class。对同一个表单或 tab 避免同时使用 Vue 和 weui.js 初始化 DOM 事件，以免重复监听。

weui.js 会在 body 下添加弹层，自定义弹层样式应放在全局 CSS 中；长期存在的弹层在页面卸载时调用 hide()。动态字符串通过 ui 包装层传入，新增 picker/actionSheet 动态标签时同样先 escapeText()，不要直接插入用户 HTML。loading 使用 withLoading()，异步任务成功或失败后都会关闭。

默认不加入路由、状态库、请求库或微信 JS-SDK，业务需要时再引入。当前表单仅演示，无后端；通知开关不会申请系统通知权限。WeUI 外观不等同于微信授权、支付等能力，这些能力需独立接入 JS-SDK 与服务端。本项目面向浏览器，weui.js 依赖 DOM，不适用于微信小程序。

## 依赖与升级

WeUI、weui.js、Vue、Vite 等采用创建时 npm latest 稳定版；TypeScript 使用 vue-tsc 支持的最新 6.0.3（其当前依赖要求 <7，最新 7.0.2 实测无法运行类型检查）。所有版本固定，pnpm-lock.yaml 保证安装可复现。更新前阅读 [版本与用法指南](docs/weui-guide.md)。

官方入口：[WeUI](https://github.com/Tencent/weui)、[Wiki](https://github.com/Tencent/weui/wiki)、[weui.js](https://github.com/Tencent/weui.js)、[API 文档](https://github.com/Tencent/weui.js/blob/master/docs/README.md)、[weui.js Wiki](https://github.com/Tencent/weui.js/wiki)。
