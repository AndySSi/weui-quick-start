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

VS Code 推荐安装 UnoCSS 扩展（项目已列入推荐），提供原子类提示和查看生成样式。Prettier 同时格式化 uno.config.ts、SCSS 和 Vue 的 style 块；不自动排序原子类。

项目设置显式启用 UnoCSS 和类名下划线，并为 Vue 字符串开启自动建议。如果新增项目或配置后没有提示，在命令面板执行 `UnoCSS: Reload UnoCSS`；仍未识别时执行 `Developer: Reload Window`。多根工作区需确保本项目目录已加入工作区，并在「输出 → UnoCSS」中确认配置加载路径包含本项目的 uno.config.ts。只有匹配 UnoCSS 规则或 shortcuts 的类有装饰，WeUI 的 weui-* 类和纯 SCSS 类不由 UnoCSS 标记。

### 通过编辑器区分样式来源

| 显示效果     | 样式来源与排查方式                                                                     |
| ------------ | -------------------------------------------------------------------------------------- |
| 类名下有虚线 | 已匹配 UnoCSS 原子类或 shortcuts；悬停可查看生成的 CSS。                               |
| 类名下无虚线 | 可能是 WeUI 类、自定义 SCSS 类，也可能是未被识别的原子类；不能仅据此判断类名是否正确。 |

例如 `flex`、`text-weui-muted` 属于原子类，`page-header` 属于项目配置的 shortcut，它们都由 UnoCSS 生成；`weui-panel` 来自 WeUI，`tab-icon-wrap` 来自示例组件的 SCSS。shortcut 名称虽然看起来像普通自定义类，但其定义应在 uno.config.ts 中查找。

本项目在多根工作区新增后曾出现没有补全和虚线的情况，重载扩展或窗口后已确认恢复。扩展推荐列表不会自动安装扩展；新电脑仍需安装并启用 `antfu.unocss`。若只有自动弹出建议缺失，可在 class 字符串中按 Ctrl+Space 测试补全。

执行 `pnpm format:check`、`pnpm test`、`pnpm build`，并检查生产产物是否含页面使用的原子类和 SCSS 规则。复制模板会同时保留 uno.config.ts、样式文件和开发依赖。

参考：[UnoCSS Vite 集成](https://unocss.dev/integrations/vite)、[Wind3](https://unocss.dev/presets/wind3)、[样式重置](https://unocss.dev/guide/style-reset)、[Vite CSS 预处理器](https://vite.dev/guide/features.html#css-pre-processors)。
