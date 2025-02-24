// SendStore.ts
// 负责消息发送的处理
// 主要功能包括：
// 1. 消息发送逻辑处理
// 2. 新会话创建
// 3. 消息统计和错误处理

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sendStreamMessage, processStream, type StreamResponseChunk } from '../services/chat'
import { useMessageStore } from './MessageStore'
import { useInputStore } from './InputStore'
import { useSessionStore } from './SessionStore'

// 定义并导出发送消息管理store
export const useSendStore = defineStore('send', () => {
  // 使用统计数据
  const usageData = ref<StreamResponseChunk['usage'] | null>(null)
  // 错误信息
  const error = ref('')

  // 获取其他store实例
  const messageStore = useMessageStore()
  const inputStore = useInputStore()
  const sessionStore = useSessionStore()

  // 创建新会话（如果需要）
  const createNewSessionIfNeeded = (message: string) => {
    if (!sessionStore.currentSessionId) {
      const sessionId = Date.now().toString()
      sessionStore.switchSession(sessionId)
    }
  }

  // 添加用户消息
  const addUserMessage = (content: string) => {
    messageStore.addMessage({
      role: 'user',
      content
    })
  }

  // 添加AI消息
  const addAIMessage = (content: string = '') => {
    messageStore.addMessage({
      role: 'assistant',
      content
    })
  }

  // 设置错误信息
  const setError = (message: string) => {
    error.value = message
  }

  // 发送消息处理函数
  const sendMessage = async () => {
    const message = inputStore.getCurrentText()
    if (!message || messageStore.isLoading) return

    messageStore.setLoading(true)
    inputStore.clearInputText()
    setError('')

    try {
      // 确保有当前会话
      createNewSessionIfNeeded(message)

      // 添加用户消息
      addUserMessage(message)
      // 添加初始AI消息
      addAIMessage()

      // 发送消息并获取流式响应
      const stream = await sendStreamMessage(sessionStore.getCurrentSessionMessages.slice(0, -1))
      if (stream) {
        await processStream(
          stream,
          (content) => messageStore.handleStreamingResponse(content),
          (usage) => {
            usageData.value = usage
          }
        )
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      // 移除空的AI消息
      const messages = sessionStore.getCurrentSessionMessages
      if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
        messages.pop()
      }
      // 添加错误提示消息
      addAIMessage('请求失败，请稍后再试')
      setError('发送消息失败')
    } finally {
      messageStore.setLoading(false)
    }
  }

  return {
    usageData,
    error,
    sendMessage,
    setError
  }
})