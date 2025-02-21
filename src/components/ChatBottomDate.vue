<template>
  <div v-if="usageData" class="usage">
    <h3>资源使用统计</h3>
    <p>输入Token: {{ usageData.prompt_tokens }}</p>
    <p>输出Token: {{ usageData.completion_tokens }}</p>
    <p>总计Token: {{ usageData.total_tokens }}</p>
  </div>
</template>

<script setup lang="ts">
import type { StreamResponseChunk } from '../services/chat'

// 定义组件属性，直接使用props接收数据
defineProps<{
  usageData: StreamResponseChunk['usage'] | null
}>()
</script>

<style scoped>
@import '@/styles/ChatBottomDate.css'
</style>