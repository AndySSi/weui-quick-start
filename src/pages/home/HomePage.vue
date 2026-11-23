<script setup lang="ts">
import { ref } from 'vue'
import { ui, weui } from '../../lib/ui'
import { themePreference, setTheme } from '../../lib/theme'
import type { ThemePreference } from '../../lib/theme'
import { onBeforeUnmount } from 'vue'
let active = true
onBeforeUnmount(() => {
  active = false
})

function changeTheme(event: Event) {
  setTheme((event.target as HTMLSelectElement).value as ThemePreference)
}

const name = ref('')
const notice = ref(true)
const category = ref('个人项目')
const busy = ref(false)

function chooseCategory() {
  weui.picker(
    [
      { label: '个人项目', value: 'personal' },
      { label: '团队项目', value: 'team' },
    ],
    {
      id: 'project-category',
      title: '项目类型',
      onConfirm: (items) => {
        category.value = items[0]?.label ?? category.value
      },
    },
  )
}

function showActions() {
  weui.actionSheet(
    [
      {
        label: '查看起步说明',
        onClick: () =>
          ui.alert('编辑 src/pages/home/HomePage.vue 开始开发；README 包含模板复用和升级说明。'),
      },
    ],
    [{ label: '取消' }],
    { title: '快捷操作' },
  )
}

async function submit() {
  if (!name.value.trim()) {
    ui.topTips('请填写项目名称')
    return
  }
  busy.value = true
  try {
    await ui.withLoading(() => new Promise<void>((resolve) => setTimeout(resolve, 800)), '提交中')
    if (active) ui.toast('已完成')
  } catch {
    if (active) ui.topTips('操作失败，请重试')
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <main class="page">
    <header class="page-header">
      <p class="eyebrow">WEUI · VUE 3 · TYPESCRIPT</p>
      <h1>从这里开始</h1>
      <p class="intro">熟悉的微信体验，轻量的 Web 开发起点。</p>
      <div class="theme-control">
        <label for="theme-preference">外观</label>
        <select
          id="theme-preference"
          :value="themePreference"
          @change="changeTheme"
        >
          <option value="system">跟随系统</option>
          <option value="light">浅色模式</option>
          <option value="dark">深色模式</option>
        </select>
      </div>
    </header>

    <div class="weui-cells">
      <RouterLink
        class="weui-cell weui-cell_access"
        :to="{ name: 'projects' }"
      >
        <span class="weui-cell__bd">浏览项目</span>
        <span class="weui-cell__ft">列表与详情</span>
      </RouterLink>
      <RouterLink
        class="weui-cell weui-cell_access"
        :to="{ name: 'tabbar-demo' }"
      >
        <span class="weui-cell__bd">WeUI Tabbar 示例</span>
        <span class="weui-cell__ft">页内切换</span>
      </RouterLink>
    </div>

    <section
      class="weui-panel weui-panel_access"
      aria-labelledby="intro-title"
    >
      <h2
        id="intro-title"
        class="weui-panel__hd"
      >
        你的下一个项目
      </h2>
      <div class="weui-panel__bd">
        <div class="weui-media-box weui-media-box_text">
          <h3 class="weui-media-box__title">让想法快速落地</h3>
          <p class="weui-media-box__desc">使用官方 WeUI 样式与 weui.js 交互，专注业务本身。</p>
        </div>
      </div>
    </section>

    <form
      class="weui-form"
      @submit.prevent="submit"
    >
      <div class="weui-form__text-area">
        <h2 class="weui-form__title">创建项目</h2>
        <p class="weui-form__desc">体验表单、选择器和操作反馈</p>
      </div>
      <div class="weui-form__control-area">
        <div class="weui-cells__group weui-cells__group_form">
          <div class="weui-cells">
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label
                  class="weui-label"
                  for="project-name"
                >
                  项目名称
                </label>
              </div>
              <div class="weui-cell__bd">
                <input
                  id="project-name"
                  v-model="name"
                  class="weui-input"
                  placeholder="请输入项目名称"
                  maxlength="40"
                  autocomplete="off"
                />
              </div>
            </div>
            <button
              class="weui-cell weui-cell_access cell-button"
              type="button"
              @click="chooseCategory"
            >
              <span class="weui-cell__bd">项目类型</span>
              <span class="weui-cell__ft">{{ category }}</span>
            </button>
            <div class="weui-cell weui-cell_switch">
              <div class="weui-cell__bd">
                <label for="notice">接收通知</label>
              </div>
              <div class="weui-cell__ft">
                <input
                  id="notice"
                  v-model="notice"
                  class="weui-switch"
                  type="checkbox"
                  role="switch"
                  :aria-checked="notice"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="weui-form__opr-area">
        <button
          class="weui-btn weui-btn_primary"
          :disabled="busy"
          type="submit"
        >
          {{ busy ? '提交中…' : '体验提交' }}
        </button>
      </div>
      <p class="demo-note">演示数据仅保留在当前页面，不会发送请求。</p>
    </form>

    <section aria-labelledby="interaction-title">
      <h2
        id="interaction-title"
        class="weui-cells__title"
      >
        常用交互
      </h2>
      <div class="weui-cells">
        <button
          type="button"
          class="weui-cell weui-cell_access cell-button"
          @click="ui.toast('操作成功')"
        >
          <span class="weui-cell__bd">成功提示</span>
          <span class="weui-cell__ft">Toast</span>
        </button>
        <button
          type="button"
          class="weui-cell weui-cell_access cell-button"
          @click="ui.confirm('确认继续体验？', () => ui.toast('已确认'))"
        >
          <span class="weui-cell__bd">确认对话框</span>
          <span class="weui-cell__ft">Dialog</span>
        </button>
        <button
          type="button"
          class="weui-cell weui-cell_access cell-button"
          @click="showActions"
        >
          <span class="weui-cell__bd">操作菜单</span>
          <span class="weui-cell__ft">ActionSheet</span>
        </button>
      </div>
    </section>
    <footer class="weui-footer page-footer">
      <p class="weui-footer__text">WeUI 2.6.26 · weui.js 1.2.28</p>
      <p class="weui-footer__text">@YiDu Design for Web</p>
    </footer>
  </main>
</template>
