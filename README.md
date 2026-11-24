# WeUI Quick Start

面向移动 Web 的 Vue 3 + TypeScript + Vite 脚手架。

**WeUI + weui.js · 多页面路由 · 深色模式 · UnoCSS / SCSS · Prettier**

## 快速开始

Node.js 20.19+ 或 22.12+，pnpm 9.9.0。

```powershell
pnpm install
pnpm dev
```

打开终端输出的网址；构建执行 `pnpm build`，产物位于 `dist/`。

**创建新项目**（在模板目录执行，目标目录须不存在）：

```powershell
pnpm create ../my-weui-app
cd ../my-weui-app
pnpm install
pnpm dev
```

保留源码、配置、环境默认值和锁文件；不复制依赖、构建产物、Git 历史或 `.env.*.local` 等本地覆盖文件。

复制前请初始化下方扩展子模块。新项目获得扩展源码快照，不包含子模块的 `.git` 指针；无需初始化 Git 即可使用模板。

## 目录与开发约定

```text
weui-simple-pages/
├── src/
│   ├── pages/                     # 按业务组织页面
│   │   ├── home/HomePage.vue
│   │   ├── projects/              # 列表、详情
│   │   ├── settings/SettingsPage.vue
│   │   ├── examples/TabbarPage.vue
│   │   └── NotFoundPage.vue
│   ├── layouts/MainLayout.vue     # 顶部栏、返回、底部导航
│   ├── components/TabIcon.vue     # 共用组件；图标为自定义 SVG
│   ├── router/
│   │   ├── routes.ts              # 页面注册
│   │   └── index.ts               # 路由初始化与导航处理
│   ├── lib/
│   │   ├── theme.ts               # 主题切换与持久化
│   │   └── ui.ts                  # 提示、弹层与清理
│   ├── services/projects.ts       # 本地示例数据
│   ├── types/weui.d.ts            # weui.js 局部类型
│   ├── App.vue                    # 路由出口
│   ├── main.ts                    # 应用入口
│   └── styles.scss                # 全局样式
├── docs/                          # 路由、样式、版本指南
├── scripts/
│   ├── create.mjs                 # 复制模板
│   └── tests/routes.test.mjs      # 路由测试
├── tooling/weui-vscode/           # Git 子模块：WeUI 样式导航扩展
├── .gitmodules                    # 子模块远程地址
├── .vscode/                       # 扩展推荐与编辑器设置
├── uno.config.ts                  # 原子类、主题、shortcuts
├── vite.config.ts
├── tsconfig.json
├── .prettierrc.json               # 配合 .editorconfig 统一格式
├── .env.development               # 开发环境默认值
├── .env.production                # 生产环境默认值
├── index.html
├── package.json
└── pnpm-lock.yaml
```

**代码放哪里？**

| 内容                | 位置                                        |
| ------------------- | ------------------------------------------- |
| 新页面              | `pages/<业务>/`，在 `router/routes.ts` 注册 |
| 页面专用组件        | 对应业务目录的 `components/`，按需创建      |
| 跨页面组件 / 布局   | `components/` / `layouts/`                  |
| 基础样式 / 复杂样式 | UnoCSS / 组件内 scoped SCSS                 |

## 页面与导航

```text
App → MainLayout → 当前路由页面
          └─ 底部导航：首页 / 项目 / 设置

项目列表 → 项目详情 → 返回列表
独立 Tabbar 示例：消息 ⇄ 通讯录 ⇄ 我（页内切换）
```

默认 **Hash 路由**，静态托管无需配置业务路径回退。

| 页面            | 地址                                       |
| --------------- | ------------------------------------------ |
| 首页            | `/#/`                                      |
| 项目列表 / 详情 | `/#/projects` / `/#/projects/weui-starter` |
| 设置            | `/#/settings`                              |
| Tabbar 示例     | `/#/examples/tabbar`                       |

```vue
<RouterLink :to="{ name: 'project-detail', params: { id: 'weui-starter' } }">
  查看详情
</RouterLink>
```

详情从 URL 读取 id；筛选保存在 query；未知路径显示 404。详见 [路由指南](docs/routing.md)。

## 样式与主题

**基础样式直接写原子类：**

```vue
<div class="flex items-center gap-[12px] p-[24px] text-weui-muted">
  项目说明
</div>
```

复杂选择器、动画和定位使用 `<style scoped lang="scss">`；公共样式放在 `src/styles.scss`，重复原子类组合放在 `uno.config.ts` 的 shortcuts。

**主题：**跟随系统 / 浅色 / 深色，自动保存偏好。使用 `text-weui-muted`、`bg-weui-surface` 等变量配色，可同步适配 WeUI 与深色模式。

VS Code 安装推荐的 **UnoCSS** 扩展：有虚线的类表示已匹配原子类或 shortcuts，悬停可查看 CSS。没有提示时执行 `UnoCSS: Reload UnoCSS`，必要时重载窗口。

更多示例见 [样式指南](docs/styling.md)。

### 添加 WeUI 编辑器插件

插件通过 [Git 子模块](https://github.com/AndySSi/weui-style-nav) 引入，固定在脚手架记录的提交版本。

```powershell
git submodule update --init --recursive
pnpm --dir tooling/weui-vscode install --frozen-lockfile
pnpm weui:editor:package
pnpm weui:editor:install
```

新克隆也可使用 `git clone --recurse-submodules <脚手架仓库地址>`。模板复制得到的源码快照跳过第一步。

安装后重载 VS Code：WeUI 类显示实线，`Ctrl+点击` / `F12` 跳到 CSS；UnoCSS 保留虚线。详见 [编辑器配置](docs/styling.md#weui-样式装饰与跳转)。

## 常用命令

| 命令                | 用途                                    |
| ------------------- | --------------------------------------- |
| `pnpm format`       | Prettier 格式化；VS Code 支持保存格式化 |
| `pnpm format:check` | 检查格式                                |
| `pnpm test`         | 路由解析测试                            |
| `pnpm build`        | 类型检查 + 生产构建                     |
| `pnpm preview`      | 预览构建产物                            |

提交前执行：`pnpm format:check` → `pnpm test` → `pnpm build`。视觉效果和微信兼容性需真机验收。

## 环境配置

| 命令         | 自动加载           | 应用标题              |
| ------------ | ------------------ | --------------------- |
| `pnpm dev`   | `.env.development` | WeUI 快速起步（开发） |
| `pnpm build` | `.env.production`  | WeUI 快速起步         |

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL // 默认 /api，预留给后端请求
const mode = import.meta.env.MODE // development / production
```

标题已用于 HTML 与路由页面；API 地址仅预留，尚未接入请求或开发代理。类型声明位于 `src/types/env.d.ts`。

本地覆盖使用 `.env.development.local` 或 `.env.production.local`（Git 已忽略）。修改配置后重启开发服务；生产环境需重新构建，`pnpm preview` 只预览已有产物。`VITE_` 变量会进入浏览器代码，勿存放密钥。

## 使用前了解

- 面向浏览器；weui.js 依赖 DOM，不适用于微信小程序。
- 示例使用本地数据，无后端；微信授权、支付需另行接入。
- 弹层通过 `lib/ui.ts` 创建以统一清理；动态文本先转义。
- 依赖版本已锁定；TypeScript 使用兼容 vue-tsc 的 6.0.3。升级前阅读 [版本指南](docs/weui-guide.md)。

官方文档：[WeUI](https://github.com/Tencent/weui) · [weui.js API](https://github.com/Tencent/weui.js/blob/master/docs/README.md)
