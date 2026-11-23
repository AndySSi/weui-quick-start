# WeUI 版本与使用指南

核验日期：2026-11-23。npm latest：WeUI 2.6.26、weui.js 1.2.28；并与官方 Release 交叉核对。Vue 3.5.46、Vite 8.3.8、@vitejs/plugin-vue 6.0.11、vue-tsc 3.3.14 同样来自 npm latest 查询。TypeScript latest 为 7.0.2，但 vue-tsc 的 Volar 依赖要求 TypeScript <7，实测 7.0.2 报 ERR_PACKAGE_PATH_NOT_EXPORTED，因此固定最新兼容的 6.0.3。后续升级需先核对该约束。

## 历史变化如何影响项目

以下为重点变化摘记，并非完整变更记录：

| WeUI 版本 | 变化与使用建议 |
| --- | --- |
| 2.6.7 | 色板向 design tokens 对齐；优先引用官方颜色变量。 |
| 2.6.9、2.6.20 | 按钮样式、宽度规范变化；升级后检查布局。 |
| 2.6.12 | 搜索栏新增多种外观；旧示例需要核对结构。 |
| 2.6.16 | 对话框 UI 更新。 |
| 2.6.19、2.6.21 | Toast 样式与宽度适配更新，包括包装结构；CSS 和 JS 组合需要一起验证。 |
| 2.6.23、2.6.24 | 构建支持单独 Less 文件及组件映射；脚手架先全量引入 CSS，便于起步。 |
| 2.6.25 | 上传缩略图支持删除，改善无障碍和搜索栏对齐。 |
| 2.6.26 | 修复半屏对话框媒体条件及打印场景对话框居中。 |

来源：[官方 CHANGELOG](https://github.com/Tencent/weui/blob/master/CHANGELOG.md)。注意 GitHub 最新 Release 正文存在旧版本标题，版本与日期以 CHANGELOG、tag、npm 发布信息交叉确认。

| weui.js 版本 | 重点变化 |
| --- | --- |
| 1.2.21 | 日期选择器增加深度选项。 |
| 1.2.24 | Release 正文描述对话框统一外观，但正文版本号与 tag 不一致；以源码差异核验。 |
| 1.2.25 | actionSheet 菜单增加描述。 |
| 1.2.26 | 修复 actionSheet 菜单点击事件。 |
| 1.2.27 | actionSheet 统一 iOS 风格。 |
| 1.2.28 | 修复重复调用 Toast 时内容未更新。 |

来源：[官方 Releases](https://github.com/Tencent/weui.js/releases)。WeUI 与 weui.js 版本号独立，不能按相同版本号配对。

## 持续查看最新变化

1. 执行 `pnpm check:updates` 查看本地依赖差距，使用 `npm view weui version`、`npm view weui.js version` 确认 npm 最新稳定版。
2. 阅读 [WeUI Releases](https://github.com/Tencent/weui/releases)、CHANGELOG 和 [weui.js Releases](https://github.com/Tencent/weui.js/releases)。Wiki 用于概览，API 以仓库 docs 和当前版本源码为准。
3. 使用 GitHub Compare 对比已安装 tag 与目标 tag，例如 [WeUI 2.6.25 → 2.6.26](https://github.com/Tencent/weui/compare/v2.6.25...v2.6.26)、[weui.js 1.2.27 → 1.2.28](https://github.com/Tencent/weui.js/compare/v1.2.27...v1.2.28)。可在 GitHub Watch 中订阅 Releases。
4. 在独立分支升级指定版本：`pnpm add --save-exact weui@<版本> weui.js@<版本>`，提交 package.json 和锁文件；同步更新本地类型与示例版本标识。
5. 执行 `pnpm type-check` 和 `pnpm build`。在微信 iOS/Android WebView 验证表单焦点、软键盘、安全区域、深色模式、Picker、ActionSheet、确认/取消、重复 Toast 与 loading 失败关闭。构建通过不代表真实 WebView 验收完成。

## 主题适配约定

项目支持跟随系统、浅色与深色模式，入口位于页面的「外观」选择器。`src/lib/theme.ts` 负责偏好持久化、系统主题监听和跨标签页同步；localStorage 不可用时降级为当前页面内切换。

WeUI 2.6.26 内置深色变量与组件样式，通过 `body[data-weui-theme="dark" | "light"]` 显式控制，确保 body 下的 weui.js 弹层与页面同步。项目自定义背景和文字颜色也在 body 下引用官方变量，原生控件通过 color-scheme 适配。

验证主题时应覆盖：首次跟随系统、手动选择覆盖系统、刷新恢复偏好、切回跟随系统、系统主题变化、跨标签页同步，以及 Dialog、Toast、ActionSheet、Picker 的深色显示。类型检查与构建已通过；微信真机视觉验收仍需在目标环境完成。

## API 选用

官方 [API 索引](https://github.com/Tencent/weui.js/blob/master/docs/README.md) 包含 alert、confirm、toast、loading、topTips、actionSheet、picker、表单与上传等。示例用 ui.toast()/ui.confirm()/ui.withLoading()；picker 和 actionSheet 直接通过导出的 weui 使用。

picker 的回调返回选中项数组（包含 label/value），不是单个 value；id 会缓存选择位置。提交前自行检查业务数据。扩展 API 时先看对应版本 docs/component 与 src，补充类型后使用，不要用 any 掩盖签名差异。
