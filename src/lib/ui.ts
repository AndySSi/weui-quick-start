import weui from "weui.js";

// weui.js 使用 HTML 模板插值，动态文本先转义；不要传入未经处理的用户 HTML。
export function escapeText(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
}

export const ui = {
  toast: (text: string) => weui.toast(escapeText(text)),
  alert: (text: string) => weui.alert(escapeText(text)),
  confirm: (text: string, onConfirm: () => void) =>
    weui.confirm(escapeText(text), onConfirm),
  topTips: (text: string) => weui.topTips(escapeText(text)),
  async withLoading<T>(work: () => Promise<T>, text = "加载中"): Promise<T> {
    const loading = weui.loading(escapeText(text));
    try {
      return await work();
    } finally {
      loading.hide();
    }
  },
};

export { weui };
