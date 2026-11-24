import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import { closeOverlays } from '../lib/ui'

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})
router.afterEach((to, _from, failure) => {
  if (failure) return
  closeOverlays()
  document.title = `${String(to.meta.title ?? '首页')} · ${import.meta.env.VITE_APP_NAME}`
})

router.beforeEach((guard) => {
  console.log('[router.beforeEach] =', guard)
})
