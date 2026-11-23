<script setup lang="ts">
import { themePreference, setTheme } from '../../lib/theme'
import type { ThemePreference } from '../../lib/theme'
function changeTheme(event: Event) {
  setTheme((event.target as HTMLSelectElement).value as ThemePreference)
}
</script>
<template>
  <main class="page">
    <header class="page-header">
      <h1>设置</h1>
      <p class="intro">外观偏好在所有页面共享，并在刷新后保留。</p>
    </header>
    <div class="weui-cells">
      <div class="weui-cell">
        <div class="weui-cell__bd"><label for="settings-theme">外观</label></div>
        <div class="theme-control settings-theme">
          <select
            id="settings-theme"
            :value="themePreference"
            @change="changeTheme"
          >
            <option value="system">跟随系统</option>
            <option value="light">浅色模式</option>
            <option value="dark">深色模式</option>
          </select>
        </div>
      </div>
    </div>
    <h2 class="weui-cells__title">示例</h2>
    <div class="weui-cells">
      <RouterLink
        class="weui-cell weui-cell_access"
        :to="{ name: 'tabbar-demo' }"
      >
        <span class="weui-cell__bd">WeUI Tabbar</span>
        <span class="weui-cell__ft">查看示例</span>
      </RouterLink>
    </div>
  </main>
</template>
