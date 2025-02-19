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

    <!-- 聊天记录显示区域，使用ref获取DOM元素用于滚动控制 -->
    <div ref="chatLogRef" class="chat-log">
      <!-- 遍历显示聊天消息，根据角色应用不同样式 -->
      <div
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="['message-bubble', message.role === 'user' ? 'user-message' : 'ai-message']"
      >
        <pre>{{ message.content }}</pre>
      </div>
    </div>
    <!-- 消息输入区域 -->
    <div class="input-container">
      <!--  第二个vuetify组件更新  -->
      <v-text-field
          v-model="inputText"
          :disabled="isLoading"
          label="发送消息"
          variant="outlined"
          @keyup.enter="sendMessage"
      ></v-text-field>
      <!--  第一个vuetify组件更新  -->
      <v-btn :disabled="isLoading" class="left-4" color="primary" @click="sendMessage">发送</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatMessage from './ChatMessage.vue'
import ChatBottom from './ChatBottom.vue'
<script lang="ts" setup>
// 导入所需的Vue组件和工具
import {nextTick, ref} from 'vue'
import {useChatStore} from '../store/chat'
import {sendChatMessage} from '../services/chat'

// 组件状态管理
const inputText = ref('') // 输入框文本
const chatLogRef = ref<HTMLElement | null>(null) // 聊天记录容器引用
const {messages: chatMessages, isLoading, addMessage} = useChatStore() // 从store中获取状态和方法

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

/* 聊天记录区域样式 */
.chat-log {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  margin-bottom: 10px;
}

/* 消息气泡通用样式 */
.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 15px;
  word-break: break-word;
}

/* 用户消息样式 */
.user-message {
  background: #e8f4ff;
  border-radius: 15px;
  max-width: 80%;
  align-self: flex-end;
}

/* AI消息样式 */
.ai-message {
  background: #f8f9fa;
  align-self: stretch;
  max-width: 95%;
  border-radius: 0;
  border-left: 4px solid #4a9cff;
  margin: 8px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* 消息文本样式 */
pre {
  white-space: pre-wrap;
  font-family: inherit;
  margin: 0;
  padding: 0;
  line-height: normal;
}

/* 输入区域容器样式 */
.input-container {
  display: flex;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #eee;
  background-color: #fff;
  flex-shrink: 0;
}

/* 禁用状态样式 */
.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>