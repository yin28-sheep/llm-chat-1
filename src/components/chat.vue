<template>
  <!-- 聊天界面主容器 -->
  <div class="container">
    <!-- 标题 -->
    <h1>DeepSeek-V3</h1>
    <!-- 聊天记录显示区域，使用ref获取DOM元素用于滚动控制 -->
    <div class="chat-log" ref="chatLogRef">
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
      <input
          v-model="inputText"
          class="input"
          placeholder="请输入消息"
          @keyup.enter="sendMessage"
          :disabled="isLoading"
      />
      <button class="send-button" @click="sendMessage" :disabled="isLoading">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入所需的Vue组件和工具
import { ref, nextTick } from 'vue'
import { useChatStore } from '../store/chat'
import { sendChatMessage } from '../services/chat'

// 组件状态管理
const inputText = ref('') // 输入框文本
const chatLogRef = ref<HTMLElement | null>(null) // 聊天记录容器引用
const { messages: chatMessages, isLoading, addMessage } = useChatStore() // 从store中获取状态和方法

// 滚动到聊天记录底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatLogRef.value) {
      chatLogRef.value.scrollTop = chatLogRef.value.scrollHeight
    }
  })
}

// 发送消息处理函数
const sendMessage = async () => {
  const message = inputText.value.trim()
  if (!message || isLoading.value) return

  isLoading.value = true
  // 添加用户消息到聊天记录
  addMessage({
    role: 'user',
    content: message
  })
  inputText.value = ''
  scrollToBottom()

  try {
    // 发送消息到服务器并获取回复
    const reply = await sendChatMessage(chatMessages.value)
    // 添加AI回复到聊天记录
    addMessage({
      role: 'assistant',
      content: reply
    })
    scrollToBottom()
  } catch (error) {
    // 错误处理
    addMessage({
      role: 'assistant',
      content: '请求失败，请稍后再试'
    })
  } finally {
    isLoading.value = false
  }
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

/* 聊天记录区域样式 */
.chat-log {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
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
  align-self: flex-end;
}

/* AI消息样式 */
.ai-message {
  background: #f5f5f5;
  align-self: flex-start;
}

/* 消息文本样式 */
pre {
  white-space: pre-wrap;
  font-family: inherit;
  margin: 0;
}

/* 输入区域容器样式 */
.input-container {
  display: flex;
  align-items: center;
}

/* 输入框样式 */
.input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* 发送按钮样式 */
.send-button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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