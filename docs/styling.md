# 样式开发约定

采用 UnoCSS 66.13.0 作为基础样式方案，Sass 1.108.2 处理复杂 SCSS，WeUI 继续负责官方组件的结构和视觉。

## 基础样式使用 UnoCSS

Vite 注册 `unocss/vite`，`src/main.ts` 引入 `virtual:uno.css`，`uno.config.ts` 使用 presetWind3。未引入额外 CSS reset，以免重置 WeUI 的按钮、表单等基础样式。未启用 Attributify、额外图标库或运行时 CDN。

```vue
<div class="flex items-center gap-[12px] p-[24px] bg-weui-surface">
  <p class="text-[14px] text-weui-muted">项目说明</p>
</div>
```

布局、间距、字号、对齐优先直接写原子类。重复组合可在 shortcuts 中提取，例如 page-header、intro、demo-note、page-actions，现有页面已使用这些快捷类。常规 `p-4` 采用预设的 rem 比例，需要精确像素时使用 `p-[16px]`。

动态类名应写出完整字符串：`:class="active ? 'text-weui-brand' : 'text-weui-muted'"`。不要拼接 `'text-' + color`，静态扫描无法可靠提取；真正动态的数值使用绑定 style 或 CSS 变量，有限的额外类按需配置 safelist。

## 与深色模式配合

主题颜色映射到官方变量：

| 原子类示例       | WeUI 变量    |
| ---------------- | ------------ |
| text-weui-brand  | --weui-BRAND |
| text-weui-text   | --weui-FG-0  |
| text-weui-muted  | --weui-FG-1  |
| border-weui-line | --weui-FG-3  |
| bg-weui-page     | --weui-BG-0  |
| bg-weui-surface  | --weui-BG-2  |

这些变量随 body 的 data-weui-theme 变化，手动主题和跟随系统均沿用原有 theme.ts 逻辑，不需要再维护另一套 dark 类。不要使用只跟随系统媒体查询的颜色逻辑覆盖手动偏好。

## 复杂样式使用 SCSS

页面或组件的嵌套选择器、伪元素、动画、复杂定位可放入 `<style scoped lang="scss">`。无需额外安装 sass-loader，Vite 使用项目中的 Sass 进行编译。

```vue
<style scoped lang="scss">
.status-card {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
    background: var(--weui-BRAND);
  }
}
</style>
```

可参考 `src/pages/examples/TabbarPage.vue`：内容面板使用 UnoCSS 高度、间距与主题颜色，徽标嵌套定位使用 scoped SCSS。不要对同一个属性同时写原子类和组件样式，以免依赖选择器优先级。

全局样式统一放在 `src/styles.scss`，用于基础排版、公共导航、安全区域和 WeUI 扩展。加载顺序为 WeUI CSS → UnoCSS → 项目 SCSS；后者在同等优先级下覆盖前者。weui.js 的弹层挂在 body 下，弹层样式应使用全局 SCSS，scoped 样式不会自动覆盖它们。

## 工具与验证

### WeUI 样式装饰与跳转

扩展通过 Git 子模块引入 `tooling/weui-vscode/`，上游仓库为 [AndySSi/weui-style-nav](https://github.com/AndySSi/weui-style-nav)。主仓库仅保存子模块地址和提交指针，不再维护扩展源码副本。安装一次后可用于其他安装了 WeUI 的本地项目，Vue / HTML 文件均支持。

```powershell
git submodule update --init --recursive
pnpm --dir tooling/weui-vscode install --frozen-lockfile
pnpm weui:editor:package
pnpm weui:editor:install
```

安装后执行 `Developer: Reload Window`。

| 类名来源                  | 编辑器显示        | 查看定义                     |
| ------------------------- | ----------------- | ---------------------------- |
| UnoCSS 原子类 / shortcuts | UnoCSS 扩展的虚线 | 悬停查看生成 CSS             |
| 已安装的 WeUI 类          | WeUI 扩展的实线   | Ctrl+点击 / F12 跳到实际 CSS |
| 普通自定义 SCSS 类        | 本扩展不加装饰    | 查看组件 style 或全局 SCSS   |

例如 `weui-btn_primary` 可跳到当前工作区 `weui/dist/style/weui.css` 的基础规则。扩展按工作区目录分别解析依赖，支持 pnpm；不存在的 WeUI 类不会被标记。它识别 class 和绑定 class 中完整的类名字符串，不求值动态拼接表达式。

依赖变更或缺少装饰时执行 `WeUI: Reload Style Index`，日志位于「输出 → WeUI Styles」。`weuiStyles.decorations` 关闭实线，`weuiStyles.enabled` 关闭本扩展功能。VSIX 生成在子模块根目录，不提交到 Git。安装子模块的开发依赖后，可执行 `pnpm test:weui-editor` 验证核心逻辑。

**更新扩展版本：**先在独立扩展仓库发布提交，再在脚手架执行 `git -C tooling/weui-vscode fetch origin` 和 `git -C tooling/weui-vscode checkout <提交号>`，验证后提交主仓库中的子模块指针。普通初始化命令始终使用主仓库固定的版本，不自动追踪上游最新提交。

**复制模板：**`pnpm create` 要求子模块已初始化，复制时导出扩展源码快照，并排除 `.git`、node_modules 和 VSIX；新项目不继承原仓库的 Git 指针。如需在生成项目中继续使用子模块管理，应先将快照移出目标目录，再初始化项目 Git 并使用 `git submodule add https://github.com/AndySSi/weui-style-nav.git tooling/weui-vscode` 添加。

### UnoCSS 提示与格式化

VS Code 推荐安装 UnoCSS 扩展（项目已列入推荐），提供原子类提示和查看生成样式。Prettier 同时格式化 uno.config.ts、SCSS 和 Vue 的 style 块；不自动排序原子类。

项目设置显式启用 UnoCSS 和类名下划线，并为 Vue 字符串开启自动建议。如果新增项目或配置后没有提示，在命令面板执行 `UnoCSS: Reload UnoCSS`；仍未识别时执行 `Developer: Reload Window`。多根工作区需确保本项目目录已加入工作区，并在「输出 → UnoCSS」中确认配置加载路径包含本项目的 uno.config.ts。只有匹配 UnoCSS 规则或 shortcuts 的类有装饰，WeUI 的 weui-* 类和纯 SCSS 类不由 UnoCSS 标记。

### 通过编辑器区分样式来源

| 显示效果     | 样式来源与排查方式                                                           |
| ------------ | ---------------------------------------------------------------------------- |
| 类名下有虚线 | 已匹配 UnoCSS 原子类或 shortcuts；悬停可查看生成的 CSS。                     |
| 类名下有实线 | 本地 WeUI 扩展识别的类；Ctrl+点击 / F12 跳转到对应 CSS。                     |
| 类名下无装饰 | 可能是自定义 SCSS 类、未被识别的类，或对应扩展尚未启用；不代表类名必然错误。 |

例如 `flex`、`text-weui-muted` 属于原子类，`page-header` 属于项目配置的 shortcut，它们都由 UnoCSS 生成；`weui-panel` 来自 WeUI，`tab-icon-wrap` 来自示例组件的 SCSS。shortcut 名称虽然看起来像普通自定义类，但其定义应在 uno.config.ts 中查找。

本项目在多根工作区新增后曾出现没有补全和虚线的情况，重载扩展或窗口后已确认恢复。扩展推荐列表不会自动安装扩展；新电脑仍需安装并启用 `antfu.unocss`。若只有自动弹出建议缺失，可在 class 字符串中按 Ctrl+Space 测试补全。

执行 `pnpm format:check`、`pnpm test`、`pnpm build`，并检查生产产物是否含页面使用的原子类和 SCSS 规则。复制模板会同时保留 uno.config.ts、样式文件和开发依赖。

参考：[UnoCSS Vite 集成](https://unocss.dev/integrations/vite)、[Wind3](https://unocss.dev/presets/wind3)、[样式重置](https://unocss.dev/guide/style-reset)、[Vite CSS 预处理器](https://vite.dev/guide/features.html#css-pre-processors)。
