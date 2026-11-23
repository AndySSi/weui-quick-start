import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createServer } from 'vite'
import { createMemoryHistory, createRouter } from 'vue-router'

// 使用真实路由表验证分享链接、查询参数及兜底匹配，不启动浏览器。
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
after(() => server.close())
const { routes } = await server.ssrLoadModule('/src/router/routes.ts')
const router = createRouter({ history: createMemoryHistory(), routes })

test('详情分享链接解析 id，并保持项目导航高亮', () => {
  const detail = router.resolve('/projects/weui-starter')
  assert.equal(detail.name, 'project-detail')
  assert.equal(detail.params.id, 'weui-starter')
  assert.equal(detail.meta.tab, 'projects')
  assert.equal(detail.matched.length, 2)
  assert.equal(detail.matched[1].props.default, true)
})

test('列表筛选条件可通过 URL 恢复', () => {
  const target = router.resolve({ name: 'projects', query: { status: 'active' } })
  const restored = router.resolve(target.fullPath)
  assert.equal(restored.name, 'projects')
  assert.equal(restored.query.status, 'active')
})

test('Tabbar 示例拥有独立页面且隐藏主导航', () => {
  const target = router.resolve('/examples/tabbar')
  assert.equal(target.name, 'tabbar-demo')
  assert.equal(target.meta.hideTabbar, true)
})

test('未知路径显示 404，而有效入口不会被兜底路由吞掉', () => {
  assert.equal(router.resolve('/missing/nested/page').name, 'not-found')
  assert.equal(router.resolve('/').name, 'home')
  assert.equal(router.resolve('/settings').name, 'settings')
})
