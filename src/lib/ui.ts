import rawWeui from 'weui.js'
import type { Overlay } from 'weui.js'

const overlays = new Map<Overlay, Overlay | HTMLElement>()
function track(element: Overlay | HTMLElement): Overlay {
  let closed = false
  const overlay: Overlay = {
    hide(callback) {
      if (closed) return
      closed = true
      overlays.delete(overlay)
      // toast 1.2.28 返回 DOM 节点且不提供 hide，其余 API 提供 hide。
      if ('hide' in element && typeof element.hide === 'function') element.hide(callback)
      else if ('remove' in element) {
        element.remove()
        callback?.()
      }
    },
  }
  for (const [old, node] of overlays) {
    if ('isConnected' in node && !node.isConnected) overlays.delete(old)
  }
  overlays.set(overlay, element)
  return overlay
}
export function closeOverlays() {
  for (const overlay of overlays.keys()) overlay.hide()
  overlays.clear()
}
// 所有示例弹层通过同一入口创建，导航成功后统一关闭。
const weui = {
  ...rawWeui,
  toast: (...args: Parameters<typeof rawWeui.toast>) => track(rawWeui.toast(...args)),
  alert: (...args: Parameters<typeof rawWeui.alert>) => track(rawWeui.alert(...args)),
  confirm: (...args: Parameters<typeof rawWeui.confirm>) => track(rawWeui.confirm(...args)),
  loading: (...args: Parameters<typeof rawWeui.loading>) => track(rawWeui.loading(...args)),
  topTips: (...args: Parameters<typeof rawWeui.topTips>) => track(rawWeui.topTips(...args)),
  actionSheet: (...args: Parameters<typeof rawWeui.actionSheet>) =>
    track(rawWeui.actionSheet(...args)),
  picker: (...args: Parameters<typeof rawWeui.picker>) => track(rawWeui.picker(...args)),
}

// weui.js 使用 HTML 模板插值，动态文本先转义；不要传入未经处理的用户 HTML。
export function escapeText(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  )
}

export const ui = {
  toast: (text: string) => weui.toast(escapeText(text)),
  alert: (text: string) => weui.alert(escapeText(text)),
  confirm: (text: string, onConfirm: () => void) => weui.confirm(escapeText(text), onConfirm),
  topTips: (text: string) => weui.topTips(escapeText(text)),
  async withLoading<T>(work: () => Promise<T>, text = '加载中'): Promise<T> {
    const loading = weui.loading(escapeText(text))
    try {
      return await work()
    } finally {
      loading.hide()
    }
  },
}

export { weui }
