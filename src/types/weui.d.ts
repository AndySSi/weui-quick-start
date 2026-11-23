// 本地类型仅覆盖示例使用的 API；扩展时对照官方 docs 和对应版本源码。
declare module 'weui.js' {
  export interface Overlay { hide(callback?: () => void): void }
  export interface PickerItem { label: string; value: string | number; disabled?: boolean; children?: PickerItem[] }
  interface WeUI {
    toast(content: string, options?: { duration?: number; callback?: () => void }): Overlay
    alert(content: string, callback?: () => void, options?: { title?: string }): Overlay
    confirm(content: string, onConfirm?: () => void, onCancel?: () => void, options?: { title?: string }): Overlay
    loading(content?: string): Overlay
    topTips(content: string, options?: { duration?: number }): void
    actionSheet(menus: { label: string; onClick: () => void }[], actions: { label: string; onClick?: () => void }[], options?: { title?: string; onClose?: () => void }): Overlay
    picker(items: PickerItem[], options: { id?: string; title?: string; defaultValue?: (string | number)[]; onConfirm?: (items: PickerItem[]) => void }): Overlay
  }
  const weui: WeUI
  export default weui
}
