<script setup lang="ts">
import { computed, ref } from 'vue'
import TabIcon from '../../components/TabIcon.vue'
const tabs = [
  {
    id: 'messages',
    label: '消息',
    icon: 'home',
    title: '消息列表',
    text: '这里展示最新消息。切换下方标签查看其他内容。',
  },
  {
    id: 'contacts',
    label: '通讯录',
    icon: 'projects',
    title: '我的联系人',
    text: '这里展示联系人。每个标签拥有独立内容区域。',
  },
  {
    id: 'profile',
    label: '我',
    icon: 'settings',
    title: '个人中心',
    text: '这里展示个人资料与常用服务。',
  },
] as const
const selected = ref<string>('messages')
const current = computed(() => tabs.find((tab) => tab.id === selected.value)!)
function moveTab(event: KeyboardEvent, index: number) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
  selected.value = tabs[next]!.id
  document.getElementById(`tab-${selected.value}`)?.focus()
}
</script>
<template>
  <main class="page tabbar-example">
    <header class="page-header">
      <h1>WeUI Tabbar</h1>
      <p class="intro">底部标签切换当前页内容，支持方向键导航。消息标签展示未读徽标。</p>
    </header>
    <section
      v-for="tab in tabs"
      v-show="selected === tab.id"
      :id="`panel-${tab.id}`"
      :key="tab.id"
      class="weui-panel tab-content"
      role="tabpanel"
      :aria-labelledby="`tab-${tab.id}`"
      tabindex="0"
    >
      <div class="weui-panel__bd">
        <div class="weui-media-box weui-media-box_text">
          <h2 class="weui-media-box__title">{{ tab.title }}</h2>
          <p class="example-description">{{ tab.text }}</p>
        </div>
      </div>
    </section>
    <p
      class="demo-note"
      aria-live="polite"
    >
      当前标签：{{ current.label }}
    </p>
    <div
      class="weui-tabbar app-tabbar"
      role="tablist"
      aria-label="Tabbar 示例"
    >
      <button
        v-for="(tab, index) in tabs"
        :id="`tab-${tab.id}`"
        :key="tab.id"
        type="button"
        class="weui-tabbar__item tab-button"
        :class="{ 'weui-bar__item_on': selected === tab.id }"
        role="tab"
        :aria-selected="selected === tab.id"
        :aria-controls="`panel-${tab.id}`"
        :tabindex="selected === tab.id ? 0 : -1"
        @click="selected = tab.id"
        @keydown="moveTab($event, index)"
      >
        <span class="tab-icon-wrap">
          <TabIcon :name="tab.icon" />
          <span
            v-if="tab.id === 'messages'"
            class="weui-badge tab-badge"
            aria-label="3 条未读消息"
          >
            3
          </span>
        </span>
        <span class="weui-tabbar__label">{{ tab.label }}</span>
      </button>
    </div>
  </main>
</template>
