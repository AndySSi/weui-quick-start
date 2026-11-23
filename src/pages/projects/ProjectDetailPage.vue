<script setup lang="ts">
import { computed } from 'vue'
import { projects } from '../../services/projects'
const props = defineProps<{ id: string }>()
const project = computed(() => projects.find((item) => item.id === props.id))
</script>
<template>
  <main class="page">
    <header class="page-header">
      <p class="eyebrow">PROJECT</p>
      <h1>{{ project?.name ?? '项目不存在' }}</h1>
      <p class="intro">
        {{ project?.description ?? '请检查链接，或返回项目列表选择其他项目。' }}
      </p>
    </header>
    <div
      v-if="project"
      class="weui-cells"
    >
      <div class="weui-cell">
        <div class="weui-cell__bd">项目标识</div>
        <div class="weui-cell__ft">{{ project.id }}</div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">状态</div>
        <div class="weui-cell__ft">
          {{ project.status === 'active' ? '进行中' : '已归档' }}
        </div>
      </div>
    </div>
    <div class="page-actions">
      <RouterLink
        class="weui-btn weui-btn_default"
        :to="{ name: 'projects' }"
      >
        回到项目列表
      </RouterLink>
    </div>
  </main>
</template>
