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
import { useMainStore } from './TopStore'
import { useCreateMessageStore } from './CreateMessageStore'

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
  const mainStore = useMainStore()
  const createMessageStore = useCreateMessageStore()
  // 创建新会话（如果需要）
  const createNewSessionIfNeeded = (message: string) => {
    // 检查是否需要创建新会话：当前无会话ID且TopStore中会话ID列表为空
    if (!mainStore.currentSessionId || !mainStore.sessionIds.includes(mainStore.currentSessionId)) {
      // 从消息内容中提取会话名称（取前10个字符，如果超过则添加省略号）
      const sessionName = message.length > 10 ? `${message.slice(0, 10)}...` : message
      // 使用CreateMessageStore创建新会话，它会自动更新TopStore的会话ID
      createMessageStore.createNewSession(sessionName)
      // 同步更新SessionStore
      sessionStore.switchSession(mainStore.currentSessionId)
    }
  }
  // 添加用户消息
  const addUserMessage = (content: string) => {
    if (!mainStore.currentSessionId) {
      throw new Error('无法添加消息：当前没有有效的会话ID')
    }
    // 确保当前会话的消息数组已初始化
    if (!mainStore.sessionMessages[mainStore.currentSessionId]) {
      mainStore.sessionMessages[mainStore.currentSessionId] = []
    }
    // 直接添加到TopStore的sessionMessages中
    mainStore.sessionMessages[mainStore.currentSessionId].push({
      role: 'user',
      content,
      sessionId: mainStore.currentSessionId
    })
  }
  // 添加AI消息
  const addAIMessage = (content: string = '') => {
    if (!mainStore.currentSessionId) {
      throw new Error('无法添加消息：当前没有有效的会话ID')
    }
    // 确保当前会话的消息数组已初始化
    if (!mainStore.sessionMessages[mainStore.currentSessionId]) {
      mainStore.sessionMessages[mainStore.currentSessionId] = []
    }
    // 直接添加到TopStore的sessionMessages中
    mainStore.sessionMessages[mainStore.currentSessionId].push({
      role: 'assistant',
      content,
      sessionId: mainStore.currentSessionId
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
      const messages = sessionStore.getCurrentSessionMessages
      const stream = await sendStreamMessage(messages.slice(0, -1))
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
      if (mainStore.sessionMessages[mainStore.currentSessionId]?.length > 0 && 
          mainStore.sessionMessages[mainStore.currentSessionId][mainStore.sessionMessages[mainStore.currentSessionId].length - 1].role === 'assistant') {
        mainStore.sessionMessages[mainStore.currentSessionId].pop()
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
