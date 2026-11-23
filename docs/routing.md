# 多页面开发指南

本项目是单 HTML 入口的多路由应用。App.vue 提供 RouterView，MainLayout.vue 管理公共导航，各业务页面位于 pages。页面专用组件可放在对应页面的 components 子目录；通用组件放在 src/components，共享 Vue 逻辑按需放在 src/composables。

## 添加页面

1. 在 `src/pages/<业务>/` 创建 Vue 页面组件。
2. 在 `src/router/routes.ts` 的布局 children 中注册 path、唯一 name、动态 import 和 meta.title。
3. 需要底栏高亮时设置 meta.tab 为 home、projects 或 settings；子页面设置 meta.back；独立导航示例设置 meta.hideTabbar。
4. 用 RouterLink 连接页面；业务完成后的跳转使用 useRouter()。

```vue
<RouterLink :to="{ name: 'project-detail', params: { id: 'weui-starter' } }">
  查看详情
</RouterLink>
```

```ts
const router = useRouter()
router.push({ name: 'project-detail', params: { id } })
// 登录完成、中转跳转或更新筛选条件可使用 replace，避免多余历史记录。
router.replace({ name: 'projects', query: { status: 'active' } })
```

## 参数、返回和状态

详情通过 URL id 查找示例数据，刷新或直接打开分享链接也能使用；无效 id 显示项目不存在。业务接入后在 services 中按 id 请求，不依赖上一页传入的对象。

列表筛选保存在 query。顶部返回按钮在存在 Router 记录的前一页时调用 back，否则详情回项目列表，其余回首页。不要仅依据浏览器 history.length 判断应用内返回。浏览器后退恢复保存的滚动位置，普通导航回顶部。当前不启用全局 KeepAlive，首页表单和独立 Tabbar 的局部状态离开后重置；筛选条件随 URL 恢复。更复杂列表按需增加页面缓存。

主题在全局初始化且持久化，所有页面共享。其他局部状态先放在页面，跨页面业务状态复杂后再选择状态库。

ui.ts 集中追踪示例创建的弹层，在成功导航后调用 hide 清理。通过该文件导出的 ui/weui 创建弹层，避免在业务页面直接 import weui.js 绕过清理。首页异步示例在离开页面后不再弹出成功提示。真实请求还应根据业务使用 AbortController 或任务标记取消过期结果。

## 两种 Tabbar

- MainLayout：WeUI 样式 + RouterLink，切换真实 URL，详情页仍高亮项目栏目。
- TabbarPage：WeUI 样式 + Vue ref，切换当前页内容，不修改 URL；使用 tablist/tab/tabpanel 语义，支持左右方向键、Home、End、选中态和未读徽标。

不对同一导航再调用 weui.tab()，避免与 Vue 重复操作 DOM。Tabbar 的固定定位、安全区域和共用图标样式放在全局 styles.scss，颜色继承 WeUI 主题变量。基础布局使用 UnoCSS，独立示例的徽标定位使用 scoped SCSS，具体见 [样式开发约定](styling.md)。

图标由 `src/components/TabIcon.vue` 中的内联 SVG 绘制，包含 home、projects、settings 三种，自定义图标与 WeUI 提供的布局样式分别维护。独立示例复用这些图形；业务中可在该组件中替换图形或接入自己的图标来源。SVG 使用 currentColor 继承选中态和深色主题颜色，无需为每种主题维护图片。

进入示例可点击首页或设置页的「WeUI Tabbar」，也可直接打开 `/#/examples/tabbar`。示例标签属于页内状态，切换标签不会新增浏览器历史，离开后重新进入默认显示消息。

## 部署与验收

当前 `createWebHashHistory()` 配合 Vite `base: './'`，可在静态站根目录或子目录通过 HTTP(S) 部署。若切换 History，需同步配置明确的 Vite base、Router base，并在服务器为业务路径回退 index.html；真实静态资源仍正常返回文件或 404。

验收应覆盖首页→列表→筛选→详情→返回，详情分享链接刷新、无效 id、未知路由、主题跨页、示例 Tabbar 三项切换与键盘操作、小屏底栏遮挡、微信安全区域，以及弹层打开时浏览器后退。类型检查与构建不能替代微信真机验收。

`pnpm test` 使用真实路由表验证详情参数、筛选 URL、独立 Tabbar 和 404 匹配；`pnpm build` 执行类型检查与生产构建。

参考：[Vue Router 模式](https://router.vuejs.org/guide/essentials/history-mode.html)、[嵌套路由](https://router.vuejs.org/guide/essentials/nested-routes.html)、[懒加载](https://router.vuejs.org/guide/advanced/lazy-loading.html)。
