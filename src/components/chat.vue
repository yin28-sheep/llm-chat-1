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
/* 使用 @import 引入外部样式文件 */
@import '@/styles/chat.css';

</style>