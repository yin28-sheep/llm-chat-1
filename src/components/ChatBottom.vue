<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../store/chatStore'
import { sendChatMessage } from '../services/chat'

// 组件状态管理
const inputText = ref('') // 输入框文本
const chatStore = useChatStore()
const { messages: chatMessages, isLoading } = storeToRefs(chatStore)
const { addMessage } = chatStore

// 发送消息处理函数
const sendMessage = async () => {
  const message = inputText.value.trim()
  if (!message || isLoading.value) return

  chatStore.setLoading(true)
  // 添加用户消息到聊天记录
  addMessage({
    role: 'user',
    content: message
  })
  inputText.value = ''
  emit('scroll')

  try {
    // 发送消息到服务器并获取回复
    const reply = await sendChatMessage(chatMessages.value)
    // 添加AI回复到聊天记录
    addMessage({
      role: 'assistant',
      content: reply
    })
    emit('scroll')
  } catch (error) {
    // 错误处理
    addMessage({
      role: 'assistant',
      content: '请求失败，请稍后再试'
    })
  } finally {
    chatStore.setLoading(false)
  }
}

// 定义事件
const emit = defineEmits(['scroll'])
</script>

<style scoped>
/* 输入区域容器样式 */
.input-container {
  display: flex;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #eee;
  background-color: #fff;
  flex-shrink: 0;
}

/* 输入框样式 */
.input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
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
  font-size: 14px;
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