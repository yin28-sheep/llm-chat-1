//三种形态切换，会话切换和消息处理等核心功能。
// 主要功能包括：
// 1. 模式管理：
// - 通过currentMode管理应用的三种形态（search/dialog/chat）
// - 提供setMode方法用于切换不同形态
// 2. 会话管理：
// - 维护所有会话的消息映射(sessionMessages)
// - 管理当前会话ID(currentSessionId)和消息列表(messages)
// - 提供switchSession方法用于切换会话
// 3. 消息管理：
// - 提供addMessage方法添加新消息
// - 提供clearMessages方法清空当前会话消息
// - 管理消息的加载状态(isLoading)

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message, SessionMessages } from '../types/chatMessages'

// 定义模式类型
type Mode = 'search' | 'dialog' | 'chat'

// 定义并导出聊天状态管理store
export const useChatStore = defineStore('chat', () => {
  // 所有会话的消息映射
  const sessionMessages = ref<SessionMessages>({})
  // 当前会话ID
  const currentSessionId = ref<string>('')
  // 当前会话的消息列表
  const messages = ref<Message[]>([])
  // 加载状态标志
  const isLoading = ref(false)
  // 当前模式，默认为search
  const currentMode = ref<Mode>('search')

  // 切换会话
  const switchSession = (sessionId: string) => {
    currentSessionId.value = sessionId
    // 如果是新会话，初始化消息数组
    if (!sessionMessages.value[sessionId]) {
      sessionMessages.value[sessionId] = []
    }
    // 更新当前消息列表
    messages.value = sessionMessages.value[sessionId]
  }

  // 添加新消息
  const addMessage = (message: Message) => {
    if (currentSessionId.value) {
      // 确保当前会话的消息数组已初始化
      if (!sessionMessages.value[currentSessionId.value]) {
        sessionMessages.value[currentSessionId.value] = []
      }
      // 添加消息到当前会话
      sessionMessages.value[currentSessionId.value].push(message)
      // 同步更新当前消息列表
      messages.value = sessionMessages.value[currentSessionId.value]
    }
  }

  // 清空当前会话消息
  const clearMessages = () => {
    if (currentSessionId.value) {
      sessionMessages.value[currentSessionId.value] = []
      messages.value = []
    }
  }

  // 设置加载状态
  const setLoading = (status: boolean) => {
    isLoading.value = status
  }

  // 设置当前模式
  const setMode = (mode: Mode) => {
    currentMode.value = mode
  }

  return {
    messages,
    isLoading,
    currentSessionId,
    currentMode,
    addMessage,
    clearMessages,
    setLoading,
    switchSession,
    setMode
  }
})