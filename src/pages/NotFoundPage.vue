<template>
  <main class="page">
    <header class="page-header">
      <p class="eyebrow">404</p>
      <h1>页面未找到</h1>
      <p class="intro">这个链接可能已失效，请从首页重新开始。</p>
    </header>
    <div class="page-actions">
      <RouterLink
        class="weui-btn weui-btn_primary"
        :to="{ name: 'home' }"
        replace
      >
        返回首页
      </RouterLink>
    </div>
  </main>
</template>
