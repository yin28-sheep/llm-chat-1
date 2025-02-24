// SessionStore.ts
// 负责会话管理和消息映射
// 主要功能包括：
// 1. 维护所有会话的消息映射
// 2. 管理当前会话ID
// 3. 提供会话切换和消息获取方法

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, SessionMessages } from '../types/chatMessages'

// 定义并导出会话管理store
export const useSessionStore = defineStore('session', () => {
  // 所有会话的消息映射
  const sessionMessages = ref<SessionMessages>({})
  // 当前会话ID
  const currentSessionId = ref<string>('')

  // 切换会话
  const switchSession = (sessionId: string) => {
    currentSessionId.value = sessionId
    // 如果是新会话，初始化消息数组
    if (!sessionMessages.value[sessionId]) {
      sessionMessages.value[sessionId] = []
    }
  }

  // 获取当前会话的消息列表
  const getCurrentSessionMessages = computed(() => {
    if (!currentSessionId.value || !sessionMessages.value[currentSessionId.value]) {
      return []
    }
    return sessionMessages.value[currentSessionId.value]
  })

  // 添加消息到指定会话
  const addMessageToSession = (sessionId: string, message: Message) => {
    if (!sessionMessages.value[sessionId]) {
      sessionMessages.value[sessionId] = []
    }
    sessionMessages.value[sessionId].push(message)
  }

  // 清空指定会话的消息
  const clearSessionMessages = (sessionId: string) => {
    if (sessionMessages.value[sessionId]) {
      sessionMessages.value[sessionId] = []
    }
  }

  return {
    sessionMessages,
    currentSessionId,
    getCurrentSessionMessages,
    switchSession,
    addMessageToSession,
    clearSessionMessages
  }
})