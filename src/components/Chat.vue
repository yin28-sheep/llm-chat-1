<template>
  <!-- 聊天界面主容器 -->
  <div class="container">
    <!-- 标题 -->
    <h1>DeepSeek-V3</h1>
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

<script lang="ts" setup>
// 导入所需的Vue组件和工具
import {nextTick, ref} from 'vue'
import {useChatStore} from '../store/chat'
import {sendChatMessage} from '../services/chat'

// 组件状态管理
const inputText = ref('') // 输入框文本
const chatLogRef = ref<HTMLElement | null>(null) // 聊天记录容器引用
const {messages: chatMessages, isLoading, addMessage} = useChatStore() // 从store中获取状态和方法

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