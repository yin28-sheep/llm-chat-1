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
// 定义组件的props和事件
const props = defineProps<{
  currentMode: 'search' | 'dialog' | 'chat'
}>()

const emit = defineEmits<{
  (e: 'toggle-mode', mode: 'search' | 'dialog' | 'chat'): void
}>()

// 处理模式切换
const handleModeToggle = () => {
  // 在search和chat模式之间切换
  const nextMode = props.currentMode === 'search' ? 'chat' : 'search'
  emit('toggle-mode', nextMode)
}
</script>

<style scoped>
@import '@/styles/Tools.css';
</style>