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
    </div>
  </div>
</template>

<script setup lang="ts">
// 工具栏组件逻辑
</script>

<style scoped>
.tools-container {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.tools-header {
  margin-bottom: 10px;
}

.tools-header h2 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.tools-content {
  display: flex;
  gap: 10px;
}

.tool-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tool-button:hover {
  background-color: #e0e0e0;
}

.tool-icon {
  font-size: 16px;
}

.tool-text {
  font-size: 14px;
  color: #333;
}
</style>