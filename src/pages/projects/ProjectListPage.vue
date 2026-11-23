<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projects } from '../../services/projects'
const route = useRoute()
const router = useRouter()
const status = computed(() => (route.query.status === 'active' ? 'active' : 'all'))
const visibleProjects = computed(() =>
  projects.filter((item) => status.value === 'all' || item.status === 'active'),
)
function filter(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  router.replace({ name: 'projects', query: value === 'active' ? { status: 'active' } : {} })
}
</script>
<template>
  <main class="page">
    <header class="page-header">
      <h1>项目</h1>
      <p class="intro">从列表进入详情，再返回继续浏览。</p>
      <div class="theme-control">
        <label for="project-status">状态</label>
        <select
          id="project-status"
          :value="status"
          @change="filter"
        >
          <option value="all">全部项目</option>
          <option value="active">进行中</option>
        </select>
      </div>
    </header>
    <div class="weui-cells">
      <RouterLink
        v-for="project in visibleProjects"
        :key="project.id"
        class="weui-cell weui-cell_access"
        :to="{ name: 'project-detail', params: { id: project.id } }"
      >
        <span class="weui-cell__bd">{{ project.name }}</span>
        <span class="weui-cell__ft">{{ project.status === 'active' ? '进行中' : '已归档' }}</span>
      </RouterLink>
    </div>
  </main>
</template>
