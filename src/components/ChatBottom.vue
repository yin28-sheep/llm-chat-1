// 聊天输入组件：负责用户消息的输入和发送功能
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
const inputText = ref('') // 输入框文本状态
const chatStore = useChatStore() // 初始化聊天状态管理store
const { messages: chatMessages, isLoading } = storeToRefs(chatStore) // 解构获取消息列表和加载状态
const { addMessage } = chatStore // 获取添加消息方法

// 发送消息处理函数
// 处理用户消息发送，包括：
// 1. 消息验证
// 2. 更新UI状态
// 3. 发送消息到服务器
// 4. 处理AI回复
const sendMessage = async () => {
  const message = inputText.value.trim()
  if (!message || isLoading.value) return

  chatStore.setLoading(true) // 设置加载状态
  // 添加用户消息到聊天记录
  addMessage({
    role: 'user',
    content: message
  })
  inputText.value = '' // 清空输入框
  emit('scroll') // 触发滚动事件

  try {
    // 发送消息到服务器并获取AI回复
    const reply = await sendChatMessage(chatMessages.value)
    // 添加AI回复到聊天记录
    addMessage({
      role: 'assistant',
      content: reply
    })
    emit('scroll') // 收到回复后再次触发滚动
  } catch (error) {
    // 错误处理：显示错误提示消息
    addMessage({
      role: 'assistant',
      content: '请求失败，请稍后再试'
    })
  } finally {
    chatStore.setLoading(false) // 重置加载状态
  }
}

// 定义组件事件
const emit = defineEmits(['scroll']) // 定义scroll事件用于通知父组件进行滚动
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