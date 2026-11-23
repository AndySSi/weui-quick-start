<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import TabIcon from '../components/TabIcon.vue'
const route = useRoute()
const router = useRouter()
const tabs = [
  { name: 'home', label: '首页', icon: 'home' },
  { name: 'projects', label: '项目', icon: 'projects' },
  { name: 'settings', label: '设置', icon: 'settings' },
] as const
function back() {
  if (router.options.history.state.back) router.back()
  else
    router.replace({
      name: route.name === 'project-detail' ? 'projects' : 'home',
    })
}
</script>
<template>
  <div
    class="app-shell"
    :class="{ 'has-tabbar': !route.meta.hideTabbar }"
  >
    <header class="app-header">
      <button
        v-if="route.meta.back"
        type="button"
        class="back-button"
        @click="back"
      >
        ‹ 返回
      </button>
      <span>{{ route.meta.title }}</span>
    </header>
    <RouterView />
    <nav
      v-if="!route.meta.hideTabbar"
      class="weui-tabbar app-tabbar"
      aria-label="主导航"
    >
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.name }"
        class="weui-tabbar__item"
        :class="{ 'weui-bar__item_on': route.meta.tab === tab.name }"
        :aria-current="route.meta.tab === tab.name ? 'page' : undefined"
      >
        <TabIcon :name="tab.icon" />
        <p class="weui-tabbar__label">{{ tab.label }}</p>
      </RouterLink>
    </nav>
  </div>
</template>
