<template>
  <!-- 聊天界面主容器 -->
  <div class="container">
    <!-- 标题 -->
    <h1>DeepSeek-V3</h1>
    
    <!-- 聊天消息组件 -->
    <chat-message ref="messageRef" />
    <!-- 底部输入组件 -->
    <chat-bottom @scroll="handleScroll" />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatMessage from './ChatMessage.vue'
import ChatBottom from './ChatBottom.vue'

// 组件引用
const messageRef = ref<{ scrollToBottom: () => void } | null>(null)

// 处理滚动事件
const handleScroll = () => {
  messageRef.value?.scrollToBottom()
}
</script>

<style scoped>
/* 基础样式设置 */
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

/* 主容器样式 */
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

/* 标题样式 */
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>