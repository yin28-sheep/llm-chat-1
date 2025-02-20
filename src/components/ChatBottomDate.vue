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
.usage {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.usage h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
}

.usage p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}
</style>