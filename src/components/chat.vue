// 主聊天界面组件：整合聊天消息显示和输入功能
<template>
  <!-- 聊天界面主容器 -->
  <div class="container">
    <!-- 标题：显示当前AI模型名称 -->
    <h1>DeepSeek-V3</h1>
    
    <!-- 聊天消息组件：用于显示消息历史记录 -->
    <chat-message ref="messageRef" />
    <!-- 底部输入组件：用于用户输入和发送消息 -->
    <chat-bottom @scroll="handleScroll" />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatMessage from './ChatMessage.vue'
import ChatBottom from './ChatBottom.vue'

// 组件引用：用于控制消息列表滚动
const messageRef = ref<{ scrollToBottom: () => void } | null>(null)

// 处理滚动事件：当新消息发送或接收时，滚动到底部
const handleScroll = () => {
  messageRef.value?.scrollToBottom()
}
</script>

<style scoped>
/* 基础样式设置：设置全局字体和背景色 */
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

/* 主容器样式：设置布局和视觉效果 */
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

/* 标题样式：设置标题的对齐和间距 */
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>