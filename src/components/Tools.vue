<template>
  <div class="tools-container">
    <div class="tools-header">
      <h2>工具栏</h2>
    </div>
    <div class="tools-content">
      <!-- 这里可以添加工具按钮或其他功能 -->
      <button class="tool-button">
        <span class="tool-icon">🔧</span>
        <span class="tool-text">设置</span>
      </button>
      <button class="tool-button">
        <span class="tool-icon">🔄</span>
        <span class="tool-text">刷新</span>
      </button>
      <button class="tool-button" @click="handleModeToggle">
        <span class="tool-icon">🔀</span>
        <span class="tool-text">切换</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMainStore } from '../store/TopStore'

// 使用TopStore来管理模式
const store = useMainStore()
const { activeMode } = storeToRefs(store)

// 处理模式切换
const handleModeToggle = () => {
  // 在search和chat两种模式之间切换
  const nextMode = activeMode.value === 'search' ? 'chat' : 'search'
  store.setActiveMode(nextMode)
}
</script>

<style scoped>
@import '@/styles/Tools.css';
</style>