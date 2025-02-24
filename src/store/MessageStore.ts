// MessageStore.ts
// 负责消息的处理和管理
// 主要功能包括：
// 1. 消息的添加和清空
// 2. 加载状态管理
// 3. 流式响应数据处理

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message } from '../types/chatMessages'
import { useSessionStore } from './SessionStore'

// 定义并导出消息管理store
export const useMessageStore = defineStore('message', () => {
  // 加载状态
  const isLoading = ref(false)
  // 最新的流式响应内容
  const streamContent = ref('')

  // 获取会话store实例
  const sessionStore = useSessionStore()

  // 添加新消息
  const addMessage = (message: Message) => {
    const { currentSessionId, addMessageToSession } = sessionStore
    if (currentSessionId) {
      addMessageToSession(currentSessionId, message)
    }
  }

  // 清空当前会话消息
  const clearMessages = () => {
    const { currentSessionId, clearSessionMessages } = sessionStore
    if (currentSessionId) {
      clearSessionMessages(currentSessionId)
    }
  }

  // 设置加载状态
  const setLoading = (status: boolean) => {
    isLoading.value = status
  }

  // 处理流式响应数据
  const handleStreamingResponse = (content: string) => {
    streamContent.value = content
    // 更新最后一条AI消息的内容
    const messages = sessionStore.getCurrentSessionMessages
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant') {
        lastMessage.content = content
      }
    }
  }

  return {
    isLoading,
    streamContent,
    addMessage,
    clearMessages,
    setLoading,
    handleStreamingResponse
  }
})