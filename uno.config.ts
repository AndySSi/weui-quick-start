import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  // 不引入额外 reset，保留 WeUI 对原生标签的基础样式。
  presets: [presetWind3()],
  theme: {
    colors: {
      weui: {
        brand: 'var(--weui-BRAND)',
        text: 'var(--weui-FG-0)',
        muted: 'var(--weui-FG-1)',
        line: 'var(--weui-FG-3)',
        page: 'var(--weui-BG-0)',
        surface: 'var(--weui-BG-2)',
      },
    },
  },
  // 重复的基础布局组合成语义化快捷类，单次布局直接写原子类。
  shortcuts: {
    'page-header': 'pt-[44px] px-[24px] pb-[32px]',
    eyebrow: 'text-weui-brand text-[11px] font-600 tracking-[2px] mb-[12px]',
    intro: 'text-weui-muted text-[14px]',
    'demo-note': 'text-weui-muted text-[12px] text-center mt-[16px] mx-[20px] mb-0',
    'page-footer': 'mt-[36px]',
    'page-actions': 'py-[32px] px-[24px]',
    'app-shell': 'max-w-[640px] mx-auto min-h-screen',
  },
})
