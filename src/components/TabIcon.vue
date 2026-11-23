<script setup lang="ts">
defineProps<{ name: 'home' | 'projects' | 'settings' }>()
</script>
<template>
  <svg
    class="weui-tabbar__icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      v-if="name === 'home'"
      d="M3 11 12 3l9 8v10h-6v-7H9v7H3Z"
    />
    <path
      v-else-if="name === 'projects'"
      d="M3 5h7l2 3h9v13H3Zm5 8h8m-8 4h5"
    />
    <g v-else>
      <circle
        cx="12"
        cy="12"
        r="4"
      />
      <path d="M12 2v4m0 12v4M2 12h4m12 0h4M5 5l3 3m8 8 3 3M5 19l3-3m8-8 3-3" />
    </g>
  </svg>
</template>
