import { readonly, ref } from 'vue'

export type ThemePreference = 'system' | 'light' | 'dark'
const storageKey = 'weui-theme'
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
const preference = ref<ThemePreference>('system')

function readPreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* 禁用存储时仍可切换当前页面主题。 */
  }
  return 'system'
}

function applyTheme() {
  const dark = preference.value === 'dark' || (preference.value === 'system' && systemTheme.matches)
  // 官方变量定义在 body；挂在这里也覆盖 weui.js 添加到 body 的弹层。
  document.body.dataset.weuiTheme = dark ? 'dark' : 'light'
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#111111' : '#f7f7f7')
}

export function setTheme(value: ThemePreference) {
  preference.value = value
  try {
    localStorage.setItem(storageKey, value)
  } catch {
    /* 存储不可用不影响切换。 */
  }
  applyTheme()
}

function syncStorage(event: StorageEvent) {
  if (event.key === storageKey || event.key === null) {
    preference.value = readPreference()
    applyTheme()
  }
}

preference.value = readPreference()
applyTheme()
systemTheme.addEventListener('change', applyTheme)
window.addEventListener('storage', syncStorage)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    systemTheme.removeEventListener('change', applyTheme)
    window.removeEventListener('storage', syncStorage)
  })
}

export const themePreference = readonly(preference)
