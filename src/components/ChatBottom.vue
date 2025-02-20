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
import { streamChatCompletion } from '../services/stStreamChat'
import type { stChatMessage, stChatCompletionParams, APIError } from '../models/stChatModel'

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
  console.log('[UI] 发送消息，环境变量VITE_API_KEY:', import.meta.env.VITE_API_KEY ? '存在' : '缺失');
  
  const message = inputText.value.trim()
  if (!message || isLoading.value) return

  chatStore.setLoading(true)
  addMessage({
    role: 'user',
    content: message,
    id: Date.now()
  })
  inputText.value = ''
  emit('scroll')

  // 修正临时消息类型（移除stChatMessage交叉类型）
  const tempMessage = {
    role: 'assistant' as const, // 明确指定为assistant类型
    content: '',
    id: Date.now()
  }
  
  try {
    // 初始化临时消息
    addMessage(tempMessage)

    // 使用符合类型定义的请求参数
    const stream = streamChatCompletion(import.meta.env.VITE_API_KEY, {
      model: 'xdeepseekv3',
      messages: chatMessages.value.map(({ role, content }) => ({ role, content })),
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
      stream_options: { include_usage: true }
    } satisfies stChatCompletionParams)

    console.log('[UI] 请求参数:', JSON.stringify({
      model: 'xdeepseekv3',
      messages: chatMessages.value,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
      stream_options: { include_usage: true }
    }));

    // 添加防抖滚动优化
    let scrollPending = false
    for await (const chunk of stream) {
      console.log('[UI] 收到数据块:', chunk);
      const content = [
        chunk.choices[0]?.delta?.reasoning_content,
        chunk.choices[0]?.delta?.content
      ].filter(Boolean).join('')

      if (content) {
        chatStore.updateLastMessage(tempMessage.id, content)
        
        // 每5次更新触发一次滚动
        if (!scrollPending) {
          scrollPending = true
          requestAnimationFrame(() => {
            emit('scroll')
            scrollPending = false
          })
        }
      }
    }
  } catch (error) {
    console.error('[UI] 捕获错误:', error);
    const err = error as APIError
    // 添加防御性检查
    if (tempMessage) {
      const errorMsg = err.status ? 
        (err.status === 401 ? 'API密钥无效' : 
        `请求失败 (${err.status}): ${err.message || '无错误详情'}`) : 
        '网络连接异常，请检查网络'
      chatStore.updateLastMessage(tempMessage.id, errorMsg)
    }
  } finally {
    chatStore.setLoading(false)
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