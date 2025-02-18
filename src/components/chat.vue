<template>
  <div class="container">
    <h1>DeepSeek-V3</h1>
    <div class="chat-log" ref="chatLogRef">
      <div
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="['message-bubble', message.role === 'user' ? 'user-message' : 'ai-message']"
      >
        <pre>{{ message.content }}</pre>
      </div>
    </div>
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
import { ref, nextTick } from 'vue'
import { useChatStore } from '../store/chat'
import { sendChatMessage } from '../services/chat'

const inputText = ref('')
const chatLogRef = ref<HTMLElement | null>(null)
const { messages: chatMessages, isLoading, addMessage } = useChatStore()

const scrollToBottom = () => {
  nextTick(() => {
    if (chatLogRef.value) {
      chatLogRef.value.scrollTop = chatLogRef.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  const message = inputText.value.trim()
  if (!message || isLoading.value) return

  isLoading.value = true
  // 添加用户消息
  addMessage({
    role: 'user',
    content: message
  })
  inputText.value = ''
  scrollToBottom()

  try {
    const reply = await sendChatMessage(chatMessages.value)
    // 添加AI回复
    addMessage({
      role: 'assistant',
      content: reply
    })
    scrollToBottom()
  } catch (error) {
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
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.container {
  max-width: 1000px;
  height: 700px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.chat-log {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 15px;
  word-break: break-word;
}

.user-message {
  background: #e8f4ff;
  align-self: flex-end;
}

.ai-message {
  background: #f5f5f5;
  align-self: flex-start;
}

pre {
  white-space: pre-wrap;
  font-family: inherit;
  margin: 0;
}

.input-container {
  display: flex;
  align-items: center;
}

.input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.send-button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>